import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';

function characterId(player:PlayerMp):number|null{const value=player.getVariable('veloria:characterId')??player.getVariable('characterId');return typeof value==='number'?value:null;}

export async function listVehicle(vehicleId:number,characterId:number,price:number){
  price=Math.trunc(Number(price));
  if(!Number.isFinite(price)||price<=0)throw new Error('INVALID_PRICE');
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]:any=await conn.query('SELECT id,character_id FROM character_vehicles WHERE id=? FOR UPDATE',[vehicleId]);
    const vehicle=rows[0];
    if(!vehicle||Number(vehicle.character_id)!==characterId)throw new Error('VEHICLE_NOT_OWNED');
    const[impounded]:any=await conn.query('SELECT 1 FROM impound_vehicles WHERE vehicle_id=? LIMIT 1',[vehicleId]);
    if(impounded[0])throw new Error('VEHICLE_IMPOUNDED');
    const[parked]:any=await conn.query('SELECT 1 FROM garage_vehicles WHERE vehicle_id=? LIMIT 1',[vehicleId]);
    if(parked[0])throw new Error('VEHICLE_IN_GARAGE');
    await conn.query('INSERT INTO vehicle_market(vehicle_id,seller_character_id,price) VALUES(?,?,?) ON DUPLICATE KEY UPDATE seller_character_id=VALUES(seller_character_id),price=VALUES(price),created_at=CURRENT_TIMESTAMP',[vehicleId,characterId,price]);
    await conn.commit();
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}

export async function cancelVehicleListing(vehicleId:number,characterId:number){const[r]:any=await mysql.query('DELETE FROM vehicle_market WHERE vehicle_id=? AND seller_character_id=?',[vehicleId,characterId]);return Number(r.affectedRows)===1;}
export async function getVehicleListings(){const[rows]=await mysql.query('SELECT vm.*,v.model,v.plate,v.vin,v.mileage,v.fuel,v.engine_health,v.body_health FROM vehicle_market vm JOIN character_vehicles v ON v.id=vm.vehicle_id ORDER BY vm.created_at DESC');return rows as any[];}

export async function buyListedVehicle(vehicleId:number,buyerCharacterId:number){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]:any=await conn.query('SELECT vm.*,v.character_id AS current_owner FROM vehicle_market vm JOIN character_vehicles v ON v.id=vm.vehicle_id WHERE vm.vehicle_id=? FOR UPDATE',[vehicleId]);
    const l=rows[0];
    if(!l)throw new Error('LISTING_NOT_FOUND');
    if(Number(l.seller_character_id)!==Number(l.current_owner))throw new Error('LISTING_STALE');
    if(Number(l.seller_character_id)===buyerCharacterId)throw new Error('OWN_LISTING');
    const price=Math.trunc(Number(l.price));
    if(!Number.isFinite(price)||price<=0)throw new Error('INVALID_PRICE');
    await changeBalance(buyerCharacterId,'bank',-price,'vehicle_market_buy',`vehicle:${vehicleId}`,conn);
    await changeBalance(Number(l.seller_character_id),'bank',price,'vehicle_market_sell',`vehicle:${vehicleId}`,conn);
    await conn.query('UPDATE character_vehicles SET character_id=? WHERE id=?',[buyerCharacterId,vehicleId]);
    await conn.query('DELETE FROM vehicle_keys WHERE vehicle_id=?',[vehicleId]);
    await conn.query('INSERT INTO vehicle_keys(vehicle_id,character_id) VALUES(?,?)',[vehicleId,buyerCharacterId]);
    await conn.query('INSERT INTO vehicle_owner_history(vehicle_id,from_character_id,to_character_id,price,reason) VALUES(?,?,?,?,?)',[vehicleId,l.seller_character_id,buyerCharacterId,price,'market']);
    await conn.query('DELETE FROM vehicle_market WHERE vehicle_id=?',[vehicleId]);
    await conn.commit();return true;
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}

export function registerVehicleMarketModule():void{
  mp.events.add('veloria:vehicleMarket:list',async(player:PlayerMp)=>{
    if(!characterId(player))return;
    try{player.call('veloria:vehicleMarket:data',[JSON.stringify(await getVehicleListings())]);}catch{player.call('veloria:notify',['error','Не удалось загрузить авторынок']);}
  });
  mp.events.add('veloria:vehicleMarket:create',async(player:PlayerMp,rawVehicleId:number,rawPrice:number)=>{
    const id=characterId(player);if(!id)return;
    try{const vehicleId=Math.trunc(Number(rawVehicleId));await listVehicle(vehicleId,id,Number(rawPrice));player.call('veloria:vehicleMarket:listed',[vehicleId]);player.call('veloria:notify',['success','Автомобиль выставлен на продажу']);}
    catch(error){const code=error instanceof Error?error.message:'';const message=code==='VEHICLE_IN_GARAGE'?'Сначала заберите автомобиль из гаража':code==='VEHICLE_IMPOUNDED'?'Автомобиль на штрафстоянке':code==='INVALID_PRICE'?'Некорректная цена':'Не удалось выставить автомобиль';player.call('veloria:notify',['error',message]);}
  });
  mp.events.add('veloria:vehicleMarket:cancel',async(player:PlayerMp,rawVehicleId:number)=>{
    const id=characterId(player);if(!id)return;
    const vehicleId=Math.trunc(Number(rawVehicleId));
    try{const ok=await cancelVehicleListing(vehicleId,id);if(!ok)throw new Error('LISTING_NOT_FOUND');player.call('veloria:vehicleMarket:cancelled',[vehicleId]);player.call('veloria:notify',['success','Объявление снято']);}catch{player.call('veloria:notify',['error','Не удалось снять объявление']);}
  });
  mp.events.add('veloria:vehicleMarket:buy',async(player:PlayerMp,rawVehicleId:number)=>{
    const id=characterId(player);if(!id)return;
    const vehicleId=Math.trunc(Number(rawVehicleId));
    try{await buyListedVehicle(vehicleId,id);player.call('veloria:vehicleMarket:purchased',[vehicleId]);player.call('veloria:notify',['success','Автомобиль приобретён']);}
    catch(error){const code=error instanceof Error?error.message:'';const message=code==='INSUFFICIENT_FUNDS'?'Недостаточно средств':code==='OWN_LISTING'?'Нельзя купить свой автомобиль':code==='LISTING_STALE'?'Объявление устарело':'Покупка не выполнена';player.call('veloria:notify',['error',message]);}
  });
}
