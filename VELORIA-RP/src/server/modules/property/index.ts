import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';

export async function getOwnedProperties(characterId:number){
  const [rows]=await mysql.query('SELECT * FROM properties WHERE owner_character_id=?',[characterId]);
  return rows as any[];
}

export async function getProperty(propertyId:number){
  const [rows]=await mysql.query('SELECT * FROM properties WHERE id=? LIMIT 1',[propertyId]);
  return (rows as any[])[0] ?? null;
}

export async function hasPropertyKey(propertyId:number,characterId:number){
  const [rows]=await mysql.query('SELECT 1 FROM property_keys WHERE property_id=? AND character_id=? LIMIT 1',[propertyId,characterId]);
  return (rows as any[]).length>0;
}

export async function givePropertyKey(propertyId:number,characterId:number){
  await mysql.query('INSERT IGNORE INTO property_keys(property_id,character_id) VALUES(?,?)',[propertyId,characterId]);
}

export async function revokePropertyKey(propertyId:number,characterId:number){
  await mysql.query('DELETE FROM property_keys WHERE property_id=? AND character_id=?',[propertyId,characterId]);
}

export async function setPropertyOwner(propertyId:number,characterId:number|null){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    await conn.query('UPDATE properties SET owner_character_id=? WHERE id=?',[characterId,propertyId]);
    await conn.query('DELETE FROM property_keys WHERE property_id=?',[propertyId]);
    if(characterId) await conn.query('INSERT INTO property_keys(property_id,character_id) VALUES(?,?)',[propertyId,characterId]);
    await conn.commit();
  }catch(error){
    await conn.rollback();
    throw error;
  }finally{
    conn.release();
  }
}

export async function setPropertyLocked(propertyId:number,characterId:number,locked:boolean){
  const conn=await mysql.getConnection();
  try{
    const [rows]=await conn.query(
      'SELECT 1 FROM property_keys WHERE property_id=? AND character_id=? LIMIT 1',
      [propertyId,characterId]
    );
    if(!(rows as any[]).length) return false;
    const [result]:any=await conn.query('UPDATE properties SET locked=? WHERE id=?',[locked?1:0,propertyId]);
    return Number(result.affectedRows)>0;
  }finally{
    conn.release();
  }
}

export async function buyProperty(propertyId:number,characterId:number){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const [rows]:any=await conn.query('SELECT * FROM properties WHERE id=? FOR UPDATE',[propertyId]);
    const property=rows[0];
    if(!property) throw new Error('PROPERTY_NOT_FOUND');
    if(property.owner_character_id) throw new Error('PROPERTY_OWNED');

    await changeBalance(characterId,'bank',-Number(property.price),'property_purchase',`property:${propertyId}`,conn);
    await conn.query('UPDATE properties SET owner_character_id=?,locked=1 WHERE id=? AND owner_character_id IS NULL',[characterId,propertyId]);
    await conn.query('DELETE FROM property_keys WHERE property_id=?',[propertyId]);
    await conn.query('INSERT INTO property_keys(property_id,character_id) VALUES(?,?)',[propertyId,characterId]);
    await conn.commit();
    return {...property,owner_character_id:characterId,locked:1};
  }catch(error){
    await conn.rollback();
    throw error;
  }finally{
    conn.release();
  }
}
