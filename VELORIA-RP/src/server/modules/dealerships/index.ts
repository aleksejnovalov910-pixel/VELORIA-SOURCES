import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';
import { createOwnedVehicle } from '../vehicles';

const ACCESS_RADIUS=8;
function characterId(player:PlayerMp):number|null{
  const value=player.getVariable('veloria:characterId')??player.getVariable('characterId');
  return typeof value==='number'?value:null;
}
function distance(player:PlayerMp,position:any):number{
  const dx=player.position.x-Number(position?.x),dy=player.position.y-Number(position?.y),dz=player.position.z-Number(position?.z);
  return Math.sqrt(dx*dx+dy*dy+dz*dz);
}
async function dealershipAccessible(player:PlayerMp,dealershipId:number):Promise<boolean>{
  const[rows]:any=await mysql.query('SELECT position_json FROM dealerships WHERE id=? LIMIT 1',[dealershipId]);
  if(!rows[0])return false;
  let position:any=rows[0].position_json;
  if(typeof position==='string'){try{position=JSON.parse(position);}catch{return false;}}
  return Number.isFinite(Number(position?.x))&&Number.isFinite(Number(position?.y))&&Number.isFinite(Number(position?.z))&&distance(player,position)<=ACCESS_RADIUS;
}
export async function getDealershipStock(dealershipId:number){
  const id=Math.trunc(Number(dealershipId));
  if(!Number.isFinite(id)||id<=0)throw new Error('INVALID_DEALERSHIP');
  const[rows]=await mysql.query('SELECT * FROM dealership_stock WHERE dealership_id=? AND stock>0 ORDER BY price,id',[id]);
  return rows as any[];
}
async function generateUniquePlate(connection:any):Promise<string>{
  for(let attempt=0;attempt<20;attempt++){
    const plate=`VL${Math.floor(1000+Math.random()*9000)}`;
    const[rows]:any=await connection.query('SELECT 1 FROM character_vehicles WHERE plate=? LIMIT 1',[plate]);
    if(!rows[0])return plate;
  }
  throw new Error('PLATE_GENERATION_FAILED');
}
export async function buyDealershipVehicle(characterId:number,stockId:number,expectedDealershipId?:number){
  const id=Math.trunc(Number(stockId));
  if(!Number.isFinite(id)||id<=0)throw new Error('INVALID_STOCK');
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]:any=await conn.query('SELECT * FROM dealership_stock WHERE id=? FOR UPDATE',[id]);
    const car=rows[0];
    if(!car||Number(car.stock)<=0)throw new Error('OUT_OF_STOCK');
    if(expectedDealershipId&&Number(car.dealership_id)!==expectedDealershipId)throw new Error('INVALID_DEALERSHIP');
    const price=Math.max(0,Math.trunc(Number(car.price)||0));
    if(price<=0)throw new Error('INVALID_PRICE');
    await changeBalance(characterId,'bank',-price,'vehicle_purchase',`dealership:${car.dealership_id}`,conn);
    const plate=await generateUniquePlate(conn);
    const created=await createOwnedVehicle(characterId,String(car.model),plate,undefined,conn);
    const[stockUpdate]:any=await conn.query('UPDATE dealership_stock SET stock=stock-1 WHERE id=? AND stock>0',[id]);
    if(Number(stockUpdate.affectedRows)!==1)throw new Error('OUT_OF_STOCK');
    await conn.query('INSERT INTO vehicle_owner_history(vehicle_id,from_character_id,to_character_id,price,reason) VALUES(?,NULL,?,?,?)',[created.id,characterId,price,'dealership']);
    await conn.commit();
    return{...created,model:String(car.model),plate,price,dealershipId:Number(car.dealership_id)};
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}
export function registerDealershipModule():void{
  mp.events.add('veloria:dealership:stock',async(player:PlayerMp,rawDealershipId:number)=>{
    if(!characterId(player))return;
    try{
      const dealershipId=Math.trunc(Number(rawDealershipId));
      if(!(await dealershipAccessible(player,dealershipId)))throw new Error('TOO_FAR');
      const stock=await getDealershipStock(dealershipId);
      player.setVariable('veloria:dealershipId',dealershipId);
      player.call('veloria:dealership:data',[dealershipId,JSON.stringify(stock)]);
    }catch{player.call('veloria:notify',['error','Подойдите к автосалону']);}
  });
  mp.events.add('veloria:dealership:buy',async(player:PlayerMp,rawStockId:number)=>{
    const id=characterId(player);if(!id)return;
    try{
      const dealershipId=Math.trunc(Number(player.getVariable('veloria:dealershipId'))||0);
      if(!dealershipId||!(await dealershipAccessible(player,dealershipId)))throw new Error('TOO_FAR');
      const result=await buyDealershipVehicle(id,Math.trunc(Number(rawStockId)),dealershipId);
      player.call('veloria:dealership:purchased',[JSON.stringify(result)]);
      player.call('veloria:notify',['success',`Автомобиль ${result.model} приобретён за $${result.price}`]);
    }catch(error){
      const code=error instanceof Error?error.message:'PURCHASE_FAILED';
      const message=code==='OUT_OF_STOCK'?'Автомобиль закончился':code==='INSUFFICIENT_FUNDS'?'Недостаточно средств':code==='TOO_FAR'||code==='INVALID_DEALERSHIP'?'Подойдите к выбранному автосалону':'Покупка автомобиля не выполнена';
      player.call('veloria:notify',['error',message]);
    }
  });
}
