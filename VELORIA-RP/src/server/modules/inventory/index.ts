import { mysql } from '../../core/mysql';

export type InventorySlot = { slot: number; item: string; amount: number; metadata: Record<string, unknown> };

export async function getInventory(characterId: number): Promise<InventorySlot[]> {
  const [rows] = await mysql.query('SELECT slot,item,amount,metadata_json FROM character_inventory WHERE character_id=? ORDER BY slot', [characterId]);
  return (rows as any[]).map(r => ({ slot: r.slot, item: r.item, amount: r.amount, metadata: r.metadata_json ? JSON.parse(r.metadata_json) : {} }));
}

export async function saveSlot(characterId: number, slot: InventorySlot): Promise<void> {
  await mysql.query(`INSERT INTO character_inventory(character_id,slot,item,amount,metadata_json) VALUES(?,?,?,?,?)
    ON DUPLICATE KEY UPDATE item=VALUES(item), amount=VALUES(amount), metadata_json=VALUES(metadata_json)`,
    [characterId, slot.slot, slot.item, slot.amount, JSON.stringify(slot.metadata ?? {})]);
}

export async function removeSlot(characterId: number, slot: number): Promise<void> {
  await mysql.query('DELETE FROM character_inventory WHERE character_id=? AND slot=?', [characterId, slot]);
}
