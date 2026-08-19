import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';

export async function getBusinesses(){
  const [rows]=await mysql.query('SELECT * FROM businesses ORDER BY id');
  return rows as any[];
}

export async function getOwnedBusinesses(characterId:number){
  const [rows]=await mysql.query('SELECT * FROM businesses WHERE owner_character_id=?',[characterId]);
  return rows as any[];
}

export async function getBusiness(id:number){
  const [rows]=await mysql.query('SELECT * FROM businesses WHERE id=? LIMIT 1',[id]);
  return (rows as any[])[0]??null;
}

export async function buyBusiness(id:number,characterId:number){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const [rows]:any=await conn.query('SELECT * FROM businesses WHERE id=? FOR UPDATE',[id]);
    const business=rows[0];
    if(!business) throw new Error('BUSINESS_NOT_FOUND');
    if(business.owner_character_id) throw new Error('BUSINESS_OWNED');

    const price=Number(business.price??0);
    if(price<0) throw new Error('INVALID_BUSINESS_PRICE');
    if(price>0) await changeBalance(characterId,'bank',-price,'business_purchase',`business:${id}`,conn);

    const [result]:any=await conn.query(
      'UPDATE businesses SET owner_character_id=? WHERE id=? AND owner_character_id IS NULL',
      [characterId,id]
    );
    if(Number(result.affectedRows)!==1) throw new Error('BUSINESS_OWNED');

    await conn.query(
      'INSERT INTO business_transactions(business_id,character_id,type,amount,details_json) VALUES(?,?,?,?,?)',
      [id,characterId,'purchase',price,JSON.stringify({price})]
    );
    await conn.commit();
    return {...business,owner_character_id:characterId};
  }catch(error){
    await conn.rollback();
    throw error;
  }finally{
    conn.release();
  }
}

export async function changeBusinessBalance(id:number,delta:number,characterId:number|null,type='operation',details:Record<string,unknown>={}){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const [rows]:any=await conn.query('SELECT balance FROM businesses WHERE id=? FOR UPDATE',[id]);
    if(!rows[0]) throw new Error('BUSINESS_NOT_FOUND');
    const next=Number(rows[0].balance??0)+Math.trunc(delta);
    if(next<0) throw new Error('INSUFFICIENT_BUSINESS_FUNDS');
    await conn.query('UPDATE businesses SET balance=? WHERE id=?',[next,id]);
    await conn.query(
      'INSERT INTO business_transactions(business_id,character_id,type,amount,details_json) VALUES(?,?,?,?,?)',
      [id,characterId,String(type).slice(0,48),Math.trunc(delta),JSON.stringify(details??{})]
    );
    await conn.commit();
    return next;
  }catch(error){
    await conn.rollback();
    throw error;
  }finally{
    conn.release();
  }
}

export async function setBusinessBalance(id:number,balance:number){
  const current=await getBusiness(id);
  if(!current) throw new Error('BUSINESS_NOT_FOUND');
  return changeBusinessBalance(id,Math.trunc(balance)-Number(current.balance??0),null,'admin_set_balance',{target:Math.trunc(balance)});
}
