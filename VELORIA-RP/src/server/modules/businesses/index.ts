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

    const price=Math.max(0,Math.trunc(Number(business.price??0)));
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
  const normalizedDelta=Math.trunc(Number(delta));
  if(!Number.isFinite(normalizedDelta)) throw new Error('INVALID_AMOUNT');
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const [rows]:any=await conn.query('SELECT balance FROM businesses WHERE id=? FOR UPDATE',[id]);
    if(!rows[0]) throw new Error('BUSINESS_NOT_FOUND');
    const next=Number(rows[0].balance??0)+normalizedDelta;
    if(next<0) throw new Error('INSUFFICIENT_BUSINESS_FUNDS');
    await conn.query('UPDATE businesses SET balance=? WHERE id=?',[next,id]);
    await conn.query(
      'INSERT INTO business_transactions(business_id,character_id,type,amount,details_json) VALUES(?,?,?,?,?)',
      [id,characterId,String(type).slice(0,48),normalizedDelta,JSON.stringify(details??{})]
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
  const target=Math.max(0,Math.trunc(Number(balance)||0));
  const current=await getBusiness(id);
  if(!current) throw new Error('BUSINESS_NOT_FOUND');
  return changeBusinessBalance(id,target-Number(current.balance??0),null,'admin_set_balance',{target});
}

function characterId(player:PlayerMp):number|null{
  const value=player.getVariable('veloria:characterId')??player.getVariable('characterId');
  return typeof value==='number'?value:null;
}

function businessError(error:unknown):string{
  const code=error instanceof Error?error.message:'';
  if(code==='BUSINESS_NOT_FOUND')return 'Бизнес не найден';
  if(code==='BUSINESS_OWNED')return 'У бизнеса уже есть владелец';
  if(code==='INSUFFICIENT_FUNDS')return 'Недостаточно средств на банковском счёте';
  if(code==='INSUFFICIENT_BUSINESS_FUNDS')return 'Недостаточно средств на балансе бизнеса';
  return 'Операция с бизнесом не выполнена';
}

export function registerBusinessModule():void{
  mp.events.add('veloria:business:list',async(player:PlayerMp)=>{
    try{player.call('veloria:business:data',[JSON.stringify(await getBusinesses())]);}
    catch{player.call('veloria:notify',['error','Не удалось загрузить бизнесы']);}
  });

  mp.events.add('veloria:business:owned',async(player:PlayerMp)=>{
    const id=characterId(player);if(!id)return;
    try{player.call('veloria:business:owned:data',[JSON.stringify(await getOwnedBusinesses(id))]);}
    catch{player.call('veloria:notify',['error','Не удалось загрузить ваши бизнесы']);}
  });

  mp.events.add('veloria:business:get',async(player:PlayerMp,rawId:number)=>{
    try{player.call('veloria:business:item',[JSON.stringify(await getBusiness(Number(rawId)))]);}
    catch{player.call('veloria:notify',['error','Не удалось загрузить бизнес']);}
  });

  mp.events.add('veloria:business:buy',async(player:PlayerMp,rawId:number)=>{
    const id=characterId(player);if(!id)return;
    try{
      const business=await buyBusiness(Number(rawId),id);
      player.call('veloria:business:purchased',[JSON.stringify(business)]);
      player.call('veloria:notify',['success','Бизнес приобретён']);
    }catch(error){player.call('veloria:notify',['error',businessError(error)]);}
  });
}
