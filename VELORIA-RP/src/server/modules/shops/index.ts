import { mysql } from '../../core/mysql';
import { ITEMS } from '../inventory';

const SHOPS = [
  { id: 1, name: '24/7 Strawberry', x: 25.74, y: -1347.33, z: 29.5 },
  { id: 2, name: '24/7 Vinewood', x: 373.88, y: 325.9, z: 103.57 },
  { id: 3, name: '24/7 Mirror Park', x: 1163.38, y: -323.8, z: 69.21 },
  { id: 4, name: '24/7 Vespucci', x: -1222.9, y: -906.99, z: 12.33 }
] as const;

const CATALOG: Record<string, { price: number; name: string }> = {
  water: { price: 45, name: 'Вода' },
  food: { price: 85, name: 'Сэндвич' },
  medkit: { price: 650, name: 'Аптечка' },
  phone: { price: 1250, name: 'Телефон' },
  cloth: { price: 120, name: 'Ткань' },
  scrap: { price: 160, name: 'Металлолом' },
  metal: { price: 280, name: 'Металлическая деталь' }
};

function characterId(player: PlayerMp): number | null {
  const id = Number(player.getVariable('veloria:characterId') ?? player.getVariable('characterId'));
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function shopById(raw: unknown) {
  const id = Number(raw);
  return Number.isSafeInteger(id) ? SHOPS.find(shop => shop.id === id) ?? null : null;
}

function nearby(player: PlayerMp, shop: (typeof SHOPS)[number], radius = 5): boolean {
  if (player.dimension !== 0) return false;
  const p = player.position;
  const dx = Number(p.x) - shop.x;
  const dy = Number(p.y) - shop.y;
  const dz = Number(p.z) - shop.z;
  return dx * dx + dy * dy + dz * dz <= radius * radius;
}

function notify(player: PlayerMp, type: 'success' | 'error' | 'info', text: string) {
  player.call('veloria:notify', [type, text]);
}

function shopPayload(shop: (typeof SHOPS)[number]) {
  return {
    id: shop.id,
    name: shop.name,
    items: Object.entries(CATALOG).map(([id, data]) => ({ id, ...data }))
  };
}

async function openShop(player: PlayerMp, shopId: unknown) {
  if (!characterId(player)) return;
  const shop = shopById(shopId);
  if (!shop || !nearby(player, shop)) return notify(player, 'error', 'Вы слишком далеко от магазина');
  player.call('veloria:shop:data', [JSON.stringify(shopPayload(shop))]);
}

async function purchase(player: PlayerMp, shopId: unknown, itemRaw: unknown, amountRaw: unknown) {
  const id = characterId(player);
  const shop = shopById(shopId);
  const item = String(itemRaw ?? '');
  const amount = Math.trunc(Number(amountRaw));
  const offer = CATALOG[item];
  const definition = ITEMS[item];

  if (!id || !shop || !nearby(player, shop)) return notify(player, 'error', 'Покупка недоступна');
  if (!offer || !definition) return notify(player, 'error', 'Товар не найден');
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > 20) return notify(player, 'error', 'Некорректное количество');

  const total = offer.price * amount;
  const connection = await mysql.getConnection();
  try {
    await connection.beginTransaction();
    const [walletRows] = await connection.query('SELECT cash,bank FROM characters WHERE id=? FOR UPDATE', [id]);
    const wallet = (walletRows as any[])[0];
    if (!wallet) throw new Error('CHARACTER_NOT_FOUND');
    const cash = Number(wallet.cash ?? 0);
    if (cash < total) throw new Error('INSUFFICIENT_FUNDS');

    const [inventoryRows] = await connection.query(
      'SELECT slot,item,amount,metadata_json FROM character_inventory WHERE character_id=? ORDER BY slot FOR UPDATE',
      [id]
    );
    const inventory = inventoryRows as any[];
    let capacity = (40 - inventory.length) * definition.stack;
    for (const row of inventory) {
      if (String(row.item) === item && String(row.metadata_json ?? '{}') === '{}') {
        capacity += Math.max(0, definition.stack - Number(row.amount));
      }
    }
    if (capacity < amount) throw new Error('INVENTORY_FULL');

    let left = amount;
    for (const row of inventory) {
      if (!left) break;
      if (String(row.item) !== item || String(row.metadata_json ?? '{}') !== '{}') continue;
      const current = Number(row.amount);
      if (current >= definition.stack) continue;
      const add = Math.min(left, definition.stack - current);
      await connection.query(
        'UPDATE character_inventory SET amount=amount+? WHERE character_id=? AND slot=?',
        [add, id, Number(row.slot)]
      );
      left -= add;
    }

    if (left) {
      const occupied = new Set(inventory.map(row => Number(row.slot)));
      for (let slot = 0; slot < 40 && left; slot++) {
        if (occupied.has(slot)) continue;
        const add = Math.min(left, definition.stack);
        await connection.query(
          'INSERT INTO character_inventory(character_id,slot,item,amount,metadata_json) VALUES(?,?,?,?,?)',
          [id, slot, item, add, '{}']
        );
        occupied.add(slot);
        left -= add;
      }
    }
    if (left) throw new Error('INVENTORY_FULL');

    const nextCash = cash - total;
    await connection.query('UPDATE characters SET cash=? WHERE id=?', [nextCash, id]);
    await connection.query(
      'INSERT INTO economy_transactions(character_id,account_type,amount,balance_after,reason) VALUES(?,?,?,?,?)',
      [id, 'cash', -total, nextCash, `shop:${shop.id}:${item}:${amount}`]
    );
    await connection.query(
      'INSERT INTO inventory_logs(character_id,action,item,amount,details_json) VALUES(?,?,?,?,?)',
      [id, 'shop_buy', item, amount, JSON.stringify({ shopId: shop.id, unitPrice: offer.price, total })]
    );
    await connection.commit();

    player.setVariable('veloria:cash', nextCash);
    player.call('veloria:hud:wallet', [nextCash, Number(wallet.bank ?? 0)]);
    notify(player, 'success', `${offer.name}: куплено ${amount} шт. за $${total}`);
    player.call('veloria:shop:purchased', [item, amount]);
  } catch (error) {
    await connection.rollback();
    const code = error instanceof Error ? error.message : '';
    const text = code === 'INSUFFICIENT_FUNDS'
      ? 'Недостаточно наличных'
      : code === 'INVENTORY_FULL'
        ? 'В инвентаре недостаточно места'
        : 'Не удалось выполнить покупку';
    notify(player, 'error', text);
  } finally {
    connection.release();
  }
}

export function registerShopsModule() {
  mp.events.add('veloria:shop:open', (player: PlayerMp, shopId: unknown) => {
    void openShop(player, shopId).catch(() => notify(player, 'error', 'Не удалось открыть магазин'));
  });
  mp.events.add('veloria:shop:buy', (player: PlayerMp, shopId: unknown, item: unknown, amount: unknown) => {
    void purchase(player, shopId, item, amount).catch(() => notify(player, 'error', 'Не удалось выполнить покупку'));
  });
}

export const ShopLocations = SHOPS.map(shop => ({ id: shop.id, x: shop.x, y: shop.y, z: shop.z }));
