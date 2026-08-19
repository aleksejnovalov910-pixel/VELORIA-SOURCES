import { mysql } from '../../core/mysql';

export interface MarketListingInput {
  sellerCharacterId: number;
  category: string;
  title: string;
  price: number;
  quantity: number;
  payload: Record<string, unknown>;
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
    if (Number(listing.seller_character_id) === buyerCharacterId) throw new Error('Own listing');

    const price = Number(listing.price);
    const [buyerRows] = await connection.query('SELECT bank FROM characters WHERE id=? FOR UPDATE', [buyerCharacterId]);
    const [sellerRows] = await connection.query('SELECT bank FROM characters WHERE id=? FOR UPDATE', [listing.seller_character_id]);
    const buyer = (buyerRows as any[])[0];
    const seller = (sellerRows as any[])[0];
    if (!buyer || !seller) throw new Error('Character not found');
    if (Number(buyer.bank) < price) throw new Error('Insufficient funds');

    await connection.query('UPDATE characters SET bank=bank-? WHERE id=?', [price, buyerCharacterId]);
    await connection.query('UPDATE characters SET bank=bank+? WHERE id=?', [price, listing.seller_character_id]);
    await connection.query("UPDATE market_listings SET status='sold' WHERE id=?", [listingId]);
    await connection.query('INSERT INTO market_purchases(listing_id,buyer_character_id,seller_character_id,price,payload_json) VALUES(?,?,?,?,?)', [listingId, buyerCharacterId, listing.seller_character_id, price, listing.payload_json]);
    await connection.commit();

    let payload: Record<string, unknown> = {};
    try { payload = listing.payload_json ? JSON.parse(listing.payload_json) : {}; } catch { payload = {}; }
    return { sellerCharacterId: Number(listing.seller_character_id), price, payload };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function characterId(player: PlayerMp): number | null {
  const value = player.getVariable('veloria:characterId');
  return typeof value === 'number' ? value : null;
}

export function registerMarketModule(): void {
  mp.events.add('veloria:market:list', async (player: PlayerMp, category?: string) => {
    const rows = await listActive(category ? String(category) : undefined);
    player.call('veloria:market:data', [JSON.stringify(rows)]);
  });

  mp.events.add('veloria:market:buy', async (player: PlayerMp, rawListingId: number) => {
    const id = characterId(player);
    if (!id) return;
    try {
      const purchase = await buyListing(id, Number(rawListingId));
      player.call('veloria:market:purchased', [Number(rawListingId), JSON.stringify(purchase.payload)]);
      player.call('veloria:notify', ['success', `Покупка V-Market: $${purchase.price}`]);
    } catch (error) {
      player.call('veloria:notify', ['error', error instanceof Error ? error.message : 'Покупка не выполнена']);
    }
  });
}
