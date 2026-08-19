import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';

export async function getOwnedProperties(characterId:number){ const [rows]=await mysql.query('SELECT * FROM properties WHERE owner_character_id=?',[characterId]); return rows as any[]; }
export async function getProperty(propertyId:number){ const [rows]=await mysql.query('SELECT * FROM properties WHERE id=? LIMIT 1',[propertyId]); return (rows as any[])[0] ?? null; }
export async function setPropertyOwner(propertyId:number, characterId:number|null){ await mysql.query('UPDATE properties SET owner_character_id=? WHERE id=?',[characterId,propertyId]); }
export async function setPropertyLocked(propertyId:number, characterId:number, locked:boolean){ const [r]:any=await mysql.query('UPDATE properties SET locked=? WHERE id=? AND owner_character_id=?',[locked?1:0,propertyId,characterId]); return r.affectedRows>0; }
export async function buyProperty(propertyId:number, characterId:number){
  const conn=await mysql.getConnection();
  try { await conn.beginTransaction(); const [rows]:any=await conn.query('SELECT * FROM properties WHERE id=? FOR UPDATE',[propertyId]); const property=rows[0]; if(!property) throw new Error('PROPERTY_NOT_FOUND'); if(property.owner_character_id) throw new Error('PROPERTY_OWNED'); await changeBalance(characterId,'bank',-Number(property.price),'property_purchase',`property:${propertyId}`,conn); await conn.query('UPDATE properties SET owner_character_id=? WHERE id=?',[characterId,propertyId]); await conn.commit(); return property; } catch(e){ await conn.rollback(); throw e; } finally { conn.release(); }
}
