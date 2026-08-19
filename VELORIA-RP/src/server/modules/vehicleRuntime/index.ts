import { mysql } from '../../core/mysql';
import { getGarageVehicles, parkVehicle, takeVehicle } from '../garages';

function characterId(player: PlayerMp): number | null {
  const value = player.getVariable('veloria:characterId') ?? player.getVariable('characterId');
  return typeof value === 'number' ? value : null;
}

function vec(raw: any, fallback: any) {
  if (!raw || typeof raw !== 'object') return fallback;
  return new mp.Vector3(
    Number(raw.x ?? fallback.x),
    Number(raw.y ?? fallback.y),
    Number(raw.z ?? fallback.z)
  );
}

async function garageSpawn(garageId: number) {
  const [rows] = await mysql.query('SELECT spawn_json FROM garages WHERE id=? LIMIT 1', [garageId]);
  const row = (rows as any[])[0];
  if (!row) throw new Error('GARAGE_NOT_FOUND');
  let spawn: any = {};
  try {
    spawn = typeof row.spawn_json === 'string' ? JSON.parse(row.spawn_json) : (row.spawn_json ?? {});
  } catch {}
  return spawn;
}

export function registerVehicleRuntimeModule(): void {
  mp.events.add('veloria:garage:list', async (player: PlayerMp, rawGarageId: number) => {
    const id = characterId(player);
    if (!id) return;
    try {
      const garageId = Number(rawGarageId);
      const vehicles = await getGarageVehicles(id, garageId);
      player.call('veloria:garage:data', [garageId, JSON.stringify(vehicles)]);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось загрузить гараж']);
    }
  });

  mp.events.add('veloria:garage:take', async (player: PlayerMp, rawVehicleId: number, rawGarageId: number) => {
    const id = characterId(player);
    if (!id) return;
    const vehicleId = Number(rawVehicleId);
    const garageId = Number(rawGarageId);
    try {
      const [rows] = await mysql.query('SELECT * FROM character_vehicles WHERE id=? AND character_id=? LIMIT 1', [vehicleId, id]);
      const data = (rows as any[])[0];
      if (!data) throw new Error('VEHICLE_NOT_OWNED');
      const spawn = await garageSpawn(garageId);
      const position = vec(spawn, player.position);
      const vehicle = mp.vehicles.new(data.model, position, {
        heading: Number(spawn.heading ?? 0),
        numberPlate: String(data.plate ?? 'VELORIA'),
        locked: Boolean(data.locked),
        engine: Boolean(data.engine_on),
        dimension: player.dimension
      });
      vehicle.setVariable('veloria:vehicleId', vehicleId);
      (vehicle as any).veloriaVehicleId = vehicleId;
      await takeVehicle(vehicleId, id);
      player.call('veloria:notify', ['success', `Автомобиль ${data.plate} выдан из гаража`]);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось выдать автомобиль']);
    }
  });

  mp.events.add('veloria:garage:park', async (player: PlayerMp, rawGarageId: number) => {
    const id = characterId(player);
    if (!id) return;
    const vehicle = player.vehicle;
    if (!vehicle) return;
    const vehicleId = Number((vehicle as any).veloriaVehicleId ?? vehicle.getVariable('veloria:vehicleId') ?? 0);
    if (!vehicleId) return;
    try {
      await parkVehicle(vehicleId, id, Number(rawGarageId));
      vehicle.destroy();
      player.call('veloria:notify', ['success', 'Автомобиль припаркован']);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось припарковать автомобиль']);
    }
  });
}
