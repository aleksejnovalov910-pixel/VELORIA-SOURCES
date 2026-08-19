import { mysql } from '../../core/mysql';
export async function getOwnedProperties(characterId:number){ const [rows]=await mysql.query('SELECT * FROM properties WHERE owner_character_id=?',[characterId]); return rows as any[]; }
export async function setPropertyOwner(propertyId:number, characterId:number|null){ await mysql.query('UPDATE properties SET owner_character_id=? WHERE id=?',[characterId,propertyId]); }
