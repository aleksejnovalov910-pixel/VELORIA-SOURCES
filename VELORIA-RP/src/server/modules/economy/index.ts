import { mysql } from '../../core/mysql';

export type Wallet = { cash: number; bank: number };

export async function getWallet(characterId: number): Promise<Wallet> {
  const id = Math.trunc(Number(characterId));
  if (!Number.isFinite(id) || id <= 0) throw new Error('CHARACTER_NOT_FOUND');
  const [rows] = await mysql.query('SELECT cash, bank FROM characters WHERE id=? LIMIT 1', [id]);
  const row = (rows as any[])[0];
  if (!row) throw new Error('CHARACTER_NOT_FOUND');
  return { cash: Number(row.cash ?? 0), bank: Number(row.bank ?? 0) };
}

export async function changeMoney(characterId: number, account: 'cash' | 'bank', delta: number, reason: string): Promise<Wallet> {
  const id = Math.trunc(Number(characterId));
  const amount = Math.trunc(Number(delta));
  if (!Number.isFinite(id) || id <= 0) throw new Error('CHARACTER_NOT_FOUND');
  if (!Number.isFinite(amount) || amount === 0) return getWallet(id);
  const connection = await mysql.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query('SELECT cash, bank FROM characters WHERE id=? FOR UPDATE', [id]);
    const row = (rows as any[])[0];
    if (!row) throw new Error('CHARACTER_NOT_FOUND');
    const current = Number(row[account] ?? 0);
    const next = current + amount;
    if (next < 0) throw new Error('INSUFFICIENT_FUNDS');
    await connection.query(`UPDATE characters SET ${account}=? WHERE id=?`, [next, id]);
    await connection.query(
      'INSERT INTO economy_transactions(character_id, account_type, amount, balance_after, reason) VALUES(?,?,?,?,?)',
      [id, account, amount, next, String(reason ?? 'economy').slice(0, 120)]
    );
    await connection.commit();
    return account === 'cash' ? { cash: next, bank: Number(row.bank ?? 0) } : { cash: Number(row.cash ?? 0), bank: next };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function transferBank(fromCharacterId: number, toCharacterId: number, amount: number): Promise<void> {
  const fromId = Math.trunc(Number(fromCharacterId));
  const toId = Math.trunc(Number(toCharacterId));
  const value = Math.trunc(Number(amount));
  if (!Number.isFinite(fromId) || !Number.isFinite(toId) || fromId <= 0 || toId <= 0) throw new Error('CHARACTER_NOT_FOUND');
  if (fromId === toId) throw new Error('SAME_CHARACTER');
  if (!Number.isFinite(value) || value <= 0) throw new Error('INVALID_AMOUNT');

  const connection = await mysql.getConnection();
  try {
    await connection.beginTransaction();
    const firstId = Math.min(fromId, toId);
    const secondId = Math.max(fromId, toId);
    const [rows] = await connection.query(
      'SELECT id, bank FROM characters WHERE id IN (?,?) ORDER BY id FOR UPDATE',
      [firstId, secondId]
    );
    const byId = new Map((rows as any[]).map(row => [Number(row.id), row]));
    const from = byId.get(fromId);
    const to = byId.get(toId);
    if (!from || !to) throw new Error('CHARACTER_NOT_FOUND');

    const fromBefore = Number(from.bank ?? 0);
    const toBefore = Number(to.bank ?? 0);
    if (fromBefore < value) throw new Error('INSUFFICIENT_FUNDS');
    const fromAfter = fromBefore - value;
    const toAfter = toBefore + value;

    await connection.query('UPDATE characters SET bank=? WHERE id=?', [fromAfter, fromId]);
    await connection.query('UPDATE characters SET bank=? WHERE id=?', [toAfter, toId]);
    await connection.query('INSERT INTO bank_transfers(sender_character_id,receiver_character_id,amount) VALUES(?,?,?)', [fromId, toId, value]);
    await connection.query(
      'INSERT INTO economy_transactions(character_id,account_type,amount,balance_after,reason) VALUES(?,?,?,?,?),(?,?,?,?,?)',
      [fromId, 'bank', -value, fromAfter, `bank_transfer:to:${toId}`, toId, 'bank', value, toAfter, `bank_transfer:from:${fromId}`]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
