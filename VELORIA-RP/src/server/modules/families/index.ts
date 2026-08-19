import { mysql } from '../../core/mysql';

export async function getFamilyByCharacter(characterId:number){
  const [rows]=await mysql.query('SELECT f.*,fm.`rank` AS `rank` FROM family_members fm JOIN families f ON f.id=fm.family_id WHERE fm.character_id=? LIMIT 1',[characterId]);
  return (rows as any[])[0] ?? null;
}

export async function getFamilyMembers(familyId:number){
  const [rows]=await mysql.query('SELECT fm.character_id,fm.`rank` AS `rank`,c.first_name,c.last_name FROM family_members fm JOIN characters c ON c.id=fm.character_id WHERE fm.family_id=? ORDER BY fm.`rank` DESC',[familyId]);
  return rows as any[];
}

export async function createFamily(ownerCharacterId:number,name:string){
  const conn=await mysql.getConnection();
  try {
    await conn.beginTransaction();
    const [r]:any=await conn.query('INSERT INTO families(name,owner_character_id,balance) VALUES(?,?,0)',[name.trim(),ownerCharacterId]);
    await conn.query('INSERT INTO family_members(family_id,character_id,`rank`) VALUES(?,?,10)',[r.insertId,ownerCharacterId]);
    await conn.commit();
    return r.insertId as number;
  } catch(e){
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function inviteToFamily(familyId:number,characterId:number,rank=1){
  await mysql.query('INSERT INTO family_members(family_id,character_id,`rank`) VALUES(?,?,?)',[familyId,characterId,rank]);
}

export async function removeFromFamily(familyId:number,characterId:number){
  await mysql.query('DELETE FROM family_members WHERE family_id=? AND character_id=?',[familyId,characterId]);
}

export async function setFamilyRank(familyId:number,characterId:number,rank:number){
  await mysql.query('UPDATE family_members SET `rank`=? WHERE family_id=? AND character_id=?',[Math.max(1,Math.min(10,rank)),familyId,characterId]);
}
