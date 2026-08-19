import { mysql } from '../../core/mysql';
export async function getFactionMembers(factionId:number){ const [rows]=await mysql.query('SELECT * FROM faction_members WHERE faction_id=?',[factionId]); return rows as any[]; }
export async function joinFaction(characterId:number,factionId:number,rank=1){ await mysql.query('INSERT INTO faction_members(character_id,faction_id,rank) VALUES(?,?,?) ON DUPLICATE KEY UPDATE faction_id=VALUES(faction_id),rank=VALUES(rank)',[characterId,factionId,rank]); }
export async function leaveFaction(characterId:number){ await mysql.query('DELETE FROM faction_members WHERE character_id=?',[characterId]); }
