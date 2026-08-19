import { mysql } from '../../core/mysql';

export type Wallet = { cash: number; bank: number };

export async function getWallet(characterId: number): Promise<Wallet> {
  const [rows] = await mysql.query('SELECT cash, bank FROM characters WHERE id=? LIMIT 1', [characterId]);
  const row = (rows as any[])[0];
  if (!row) throw new Error('Character not found');
  return { cash: Number(row.cash ?? 0), bank: Number(row.bank ?? 0) };
}

export async function changeMoney(characterId: number, account: 'cash' | 'bank', delta: number, reason: string): Promise<Wallet> {
  const connection = await mysql.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query('SELECT cash, bank FROM characters WHERE id=? FOR UPDATE', [characterId]);
    const row = (rows as any[])[0];
    if (!row) throw new Error('Character not found');
    const current = Number(row[account] ?? 0);
    const next = current + Math.trunc(delta);
    if (next < 0) throw new Error('Insufficient funds');
    await connection.query(`UPDATE characters SET ${account}=? WHERE id=?`, [next, characterId]);
    await connection.query('INSERT INTO economy_transactions(character_id, account_type, amount, balance_after, reason) VALUES(?,?,?,?,?)', [characterId, account, Math.trunc(delta), next, reason.slice(0, 120)]);
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
  const value = Math.trunc(amount);
  if (value <= 0) throw new Error('Invalid amount');
  const connection = await mysql.getConnection();
  try {
    await connection.beginTransaction();
    const [fromRows] = await connection.query('SELECT bank FROM characters WHERE id=? FOR UPDATE', [fromCharacterId]);
    const [toRows] = await connection.query('SELECT bank FROM characters WHERE id=? FOR UPDATE', [toCharacterId]);
    const from = (fromRows as any[])[0];
    const to = (toRows as any[])[0];
    if (!from || !to) throw new Error('Character not found');
    if (Number(from.bank) < value) throw new Error('Insufficient funds');
    await connection.query('UPDATE characters SET bank=bank-? WHERE id=?', [value, fromCharacterId]);
    await connection.query('UPDATE characters SET bank=bank+? WHERE id=?', [value, toCharacterId]);
    await connection.query('INSERT INTO bank_transfers(sender_character_id,receiver_character_id,amount) VALUES(?,?,?)', [fromCharacterId, toCharacterId, value]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
