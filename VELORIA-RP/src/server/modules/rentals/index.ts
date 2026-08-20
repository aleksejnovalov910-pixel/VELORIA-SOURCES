import { mysql } from '../../core/mysql';

const RENTALS = [
  { id: 1, name: 'VELORIA Rent — Airport', x: -1034.7, y: -2732.5, z: 20.17, sx: -1029.7, sy: -2728.0, sz: 20.12, heading: 238 },
  { id: 2, name: 'VELORIA Rent — Downtown', x: -507.3, y: -670.2, z: 33.18, sx: -502.1, sy: -671.6, sz: 33.0, heading: 180 }
] as const;

const CATALOG: Record<string, { name: string; price: number }> = {
  faggio: { name: 'Faggio', price: 200 },
  blista: { name: 'Blista', price: 500 },
  prairie: { name: 'Prairie', price: 650 },
  dilettante: { name: 'Dilettante', price: 800 }
};

const RENTAL_MINUTES = 30;
const spawned = new Map<number, VehicleMp>();

function characterId(player: PlayerMp): number | null {
  const id = Number(player.getVariable('veloria:characterId') ?? player.getVariable('characterId'));
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function station(raw: unknown) {
  const id = Number(raw);
  return Number.isSafeInteger(id) ? RENTALS.find(value => value.id === id) ?? null : null;
}

function near(player: PlayerMp, point: { x: number; y: number; z: number }, radius = 6) {
  if (player.dimension !== 0) return false;
  const p = player.position;
  const dx = p.x - point.x;
  const dy = p.y - point.y;
  const dz = p.z - point.z;
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}

function notify(player: PlayerMp, type: 'success' | 'error' | 'info', text: string) {
  player.call('veloria:notify', [type, text]);
}

function destroySpawned(characterId: number) {
  const vehicle = spawned.get(characterId);
  if (!vehicle) return;
  try { vehicle.destroy(); } catch { /* already gone */ }
  spawned.delete(characterId);
}

function spawnRental(characterId: number, model: string, plate: string, spawn: { x: number; y: number; z: number; heading: number }) {
  destroySpawned(characterId);
  const vehicle = mp.vehicles.new(model as any, new mp.Vector3(spawn.x, spawn.y, spawn.z), {
    heading: spawn.heading,
    numberPlate: plate,
    dimension: 0
  });
  vehicle.setVariable('veloria:rentalCharacterId', characterId);
  vehicle.setVariable('veloria:isRental', true);
  spawned.set(characterId, vehicle);
  return vehicle;
}

function payload(location: (typeof RENTALS)[number]) {
  return {
    id: location.id,
    name: location.name,
    minutes: RENTAL_MINUTES,
    vehicles: Object.entries(CATALOG).map(([model, value]) => ({ model, ...value }))
  };
}

async function open(player: PlayerMp, stationId: unknown) {
  if (!characterId(player)) return;
  const location = station(stationId);
  if (!location || !near(player, location)) return notify(player, 'error', 'Вы слишком далеко от точки аренды');
  player.call('veloria:rental:data', [JSON.stringify(payload(location))]);
}

async function rent(player: PlayerMp, stationId: unknown, modelRaw: unknown) {
  const id = characterId(player);
  const location = station(stationId);
  const model = String(modelRaw ?? '').toLowerCase();
  const offer = CATALOG[model];
  if (!id || !location || !near(player, location)) return notify(player, 'error', 'Аренда недоступна');
  if (!offer) return notify(player, 'error', 'Этот транспорт нельзя арендовать');

  const connection = await mysql.getConnection();
  let nextCash = 0;
  let bank = 0;
  let plate = '';
  try {
    await connection.beginTransaction();
    const [activeRows] = await connection.query(
      'SELECT id,expires_at FROM vehicle_rentals WHERE character_id=? AND active=1 FOR UPDATE',
      [id]
    );
    const active = (activeRows as any[])[0];
    if (active && new Date(active.expires_at).getTime() > Date.now()) throw new Error('ALREADY_RENTED');

    const [walletRows] = await connection.query('SELECT cash,bank FROM characters WHERE id=? FOR UPDATE', [id]);
    const wallet = (walletRows as any[])[0];
    if (!wallet) throw new Error('CHARACTER_NOT_FOUND');
    const cash = Number(wallet.cash ?? 0);
    bank = Number(wallet.bank ?? 0);
    if (cash < offer.price) throw new Error('INSUFFICIENT_FUNDS');
    nextCash = cash - offer.price;

    plate = `VR${String(id % 10000).padStart(4, '0')}${Math.floor(Math.random() * 90 + 10)}`.slice(0, 8);
    await connection.query('UPDATE characters SET cash=? WHERE id=?', [nextCash, id]);
    await connection.query(
      `INSERT INTO vehicle_rentals(character_id,model,plate,price,started_at,expires_at,active)
       VALUES(?,?,?,?,NOW(),DATE_ADD(NOW(),INTERVAL ? MINUTE),1)
       ON DUPLICATE KEY UPDATE model=VALUES(model),plate=VALUES(plate),price=VALUES(price),started_at=NOW(),expires_at=VALUES(expires_at),active=1`,
      [id, model, plate, offer.price, RENTAL_MINUTES]
    );
    await connection.query(
      'INSERT INTO economy_transactions(character_id,account_type,amount,balance_after,reason) VALUES(?,?,?,?,?)',
      [id, 'cash', -offer.price, nextCash, `vehicle_rental:${model}:${RENTAL_MINUTES}m`]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    const code = error instanceof Error ? error.message : '';
    const text = code === 'ALREADY_RENTED'
      ? 'У вас уже есть активная аренда'
      : code === 'INSUFFICIENT_FUNDS'
        ? 'Недостаточно наличных'
        : 'Не удалось оформить аренду';
    return notify(player, 'error', text);
  } finally {
    connection.release();
  }

  const vehicle = spawnRental(id, model, plate, { x: location.sx, y: location.sy, z: location.sz, heading: location.heading });
  player.setVariable('veloria:cash', nextCash);
  player.call('veloria:hud:wallet', [nextCash, bank]);
  player.call('veloria:rental:created', [vehicle.id, model, RENTAL_MINUTES]);
  notify(player, 'success', `${offer.name} арендован на ${RENTAL_MINUTES} минут`);
}

async function restore(player: PlayerMp) {
  const id = characterId(player);
  if (!id || spawned.has(id)) return;
  const [rows] = await mysql.query(
    'SELECT model,plate,expires_at FROM vehicle_rentals WHERE character_id=? AND active=1 LIMIT 1',
    [id]
  );
  const rental = (rows as any[])[0];
  if (!rental) return;
  const expiresAt = new Date(rental.expires_at).getTime();
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    await mysql.query('UPDATE vehicle_rentals SET active=0 WHERE character_id=?', [id]);
    return;
  }

  const p = player.position;
  const vehicle = spawnRental(id, String(rental.model), String(rental.plate), {
    x: p.x + 4,
    y: p.y + 2,
    z: p.z,
    heading: Number(player.heading) || 0
  });
  player.call('veloria:rental:restored', [vehicle.id, Math.max(1, Math.ceil((expiresAt - Date.now()) / 60000))]);
}

async function end(player: PlayerMp) {
  const id = characterId(player);
  if (!id) return;
  destroySpawned(id);
  await mysql.query('UPDATE vehicle_rentals SET active=0 WHERE character_id=?', [id]);
  notify(player, 'info', 'Аренда завершена');
}

export function registerRentalModule() {
  mp.events.add('veloria:rental:open', (player: PlayerMp, stationId: unknown) => void open(player, stationId));
  mp.events.add('veloria:rental:create', (player: PlayerMp, stationId: unknown, model: unknown) => void rent(player, stationId, model));
  mp.events.add('veloria:rental:restore', (player: PlayerMp) => void restore(player));
  mp.events.add('veloria:rental:end', (player: PlayerMp) => void end(player));
  mp.events.add('playerQuit', (player: PlayerMp) => {
    const id = characterId(player);
    if (id) destroySpawned(id);
  });

  const timer = setInterval(() => {
    void mysql.query('UPDATE vehicle_rentals SET active=0 WHERE active=1 AND expires_at<=NOW()').catch(() => undefined);
    for (const [id, vehicle] of spawned) {
      try {
        if (!vehicle || !mp.vehicles.exists(vehicle)) spawned.delete(id);
      } catch {
        spawned.delete(id);
      }
    }
  }, 60_000);
  timer.unref?.();
}
