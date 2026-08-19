import { mysql } from '../../core/mysql';
export async function getBusinesses(){ const [rows]=await mysql.query('SELECT * FROM businesses ORDER BY id'); return rows as any[]; }
export async function getOwnedBusinesses(characterId:number){ const [rows]=await mysql.query('SELECT * FROM businesses WHERE owner_character_id=?',[characterId]); return rows as any[]; }
export async function setBusinessBalance(id:number,balance:number){ await mysql.query('UPDATE businesses SET balance=? WHERE id=?',[balance,id]); }
