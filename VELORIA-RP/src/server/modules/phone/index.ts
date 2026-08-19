import { mysql } from '../../core/mysql';
export async function getPhone(characterId:number){ const [rows]=await mysql.query('SELECT * FROM phones WHERE character_id=? LIMIT 1',[characterId]); return (rows as any[])[0] ?? null; }
export async function ensurePhone(characterId:number){ const phone=await getPhone(characterId); if(phone) return phone; const number=`555${String(characterId).padStart(6,'0')}`; await mysql.query('INSERT INTO phones(character_id,number,settings_json) VALUES(?,?,?)',[characterId,number,JSON.stringify({theme:'dark'})]); return getPhone(characterId); }
