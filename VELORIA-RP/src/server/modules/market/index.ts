import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';

export interface MarketListingInput {
  sellerCharacterId: number;
  category: string;
  title: string;
  price: number;
  quantity: number;
  payload: Record<string, unknown>;
}

function parsePayload(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === 'object') return value as Record<string, unknown>;
  if (typeof value !== 'string') return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export async function createListing(input: MarketListingInput): Promise<number> {
  const price = Math.max(1, Math.trunc(input.price));
  const quantity = Math.max(1, Math.trunc(input.quantity));
  const [result]: any = await mysql.query(
    "INSERT INTO market_listings(seller_character_id,category,title,price,quantity,payload_json,status,created_at) VALUES(?,?,?,?,?,?,'active',NOW())",
    [input.sellerCharacterId, input.category.slice(0, 64), input.title.slice(0, 160), price, quantity, JSON.stringify(input.payload ?? {})]
  );
  return Number(result.insertId);
}

export async function listActive(category?: string): Promise<any[]> {
  const [rows] = category
    ? await mysql.query("SELECT * FROM market_listings WHERE status='active' AND category=? ORDER BY price,id", [category])
    : await mysql.query("SELECT * FROM market_listings WHERE status='active' ORDER BY created_at DESC LIMIT 250");
  return rows as any[];
}

export async function cancelListing(characterId: number, listingId: number): Promise<boolean> {
  const [result]: any = await mysql.query("UPDATE market_listings SET status='cancelled' WHERE id=? AND seller_character_id=? AND status='active'", [listingId, characterId]);
  return Number(result.affectedRows) === 1;
}

export async function buyListing(buyerCharacterId: number, listingId: number): Promise<{ sellerCharacterId: number; price: number; payload: Record<string, unknown> }> {
  const connection = await mysql.getConnection();
  try {
    await connection.beginTransaction();
    const [listingRows] = await connection.query("SELECT * FROM market_listings WHERE id=? AND status='active' FOR UPDATE", [listingId]);
    const listing = (listingRows as any[])[0];
    if (!listing) throw new Error('Listing unavailable');

    const sellerCharacterId = Number(listing.seller_character_id);
    if (sellerCharacterId === buyerCharacterId) throw new Error('Own listing');

    const price = Math.trunc(Number(listing.price));
    if (!Number.isSafeInteger(price) || price <= 0) throw new Error('Invalid listing price');

    // Both balance changes use the same transaction and produce economy audit rows.
    await changeBalance(buyerCharacterId, 'bank', -price, 'market_purchase', `listing:${listingId}`, connection);
    await changeBalance(sellerCharacterId, 'bank', price, 'market_sale', `listing:${listingId}`, connection);

    const [soldResult]: any = await connection.query(
      "UPDATE market_listings SET status='sold' WHERE id=? AND status='active'",
      [listingId]
    );
    if (Number(soldResult.affectedRows) !== 1) throw new Error('Listing unavailable');

    await connection.query(
      'INSERT INTO market_purchases(listing_id,buyer_character_id,seller_character_id,price,payload_json) VALUES(?,?,?,?,?)',
      [listingId, buyerCharacterId, sellerCharacterId, price, listing.payload_json]
    );
    await connection.commit();

    return { sellerCharacterId, price, payload: parsePayload(listing.payload_json) };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function characterId(player: PlayerMp): number | null {
  const primary = player.getVariable('veloria:characterId');
  if (typeof primary === 'number') return primary;
  const legacy = player.getVariable('characterId');
  return typeof legacy === 'number' ? legacy : null;
}

export function registerMarketModule(): void {
  mp.events.add('veloria:market:list', async (player: PlayerMp, category?: string) => {
    try {
      const rows = await listActive(category ? String(category) : undefined);
      player.call('veloria:market:data', [JSON.stringify(rows)]);
    } catch {
      player.call('veloria:notify', ['error', 'Не удалось загрузить V-Market']);
    }
  });

  mp.events.add('veloria:market:buy', async (player: PlayerMp, rawListingId: number) => {
    const id = characterId(player);
    const listingId = Math.trunc(Number(rawListingId));
    if (!id || !Number.isSafeInteger(listingId) || listingId <= 0) return;
    try {
      const purchase = await buyListing(id, listingId);
      player.call('veloria:market:purchased', [listingId, JSON.stringify(purchase.payload)]);
      player.call('veloria:notify', ['success', `Покупка V-Market: $${purchase.price}`]);
    } catch (error) {
      player.call('veloria:notify', ['error', error instanceof Error ? error.message : 'Покупка не выполнена']);
    }
  });
}
