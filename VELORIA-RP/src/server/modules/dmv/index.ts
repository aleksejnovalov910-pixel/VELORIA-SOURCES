import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';

const PLATE_RE=/^[A-Z0-9]{3,8}$/;

function normalizePlate(value:string):string{return String(value??'').trim().toUpperCase();}
function characterId(player:PlayerMp):number|null{const value=player.getVariable('veloria:characterId')??player.getVariable('characterId');return typeof value==='number'?value:null;}

export async function changePlate(characterId:number,vehicleId:number,plate:string,cost=25000){
  const normalizedPlate=normalizePlate(plate);
  const normalizedCost=Math.max(0,Math.trunc(Number(cost)||0));
  if(!PLATE_RE.test(normalizedPlate))throw new Error('INVALID_PLATE');
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]:any=await conn.query('SELECT id,plate FROM character_vehicles WHERE id=? AND character_id=? FOR UPDATE',[vehicleId,characterId]);
    const vehicle=rows[0];
    if(!vehicle)throw new Error('VEHICLE_NOT_OWNED');
    if(String(vehicle.plate).toUpperCase()===normalizedPlate)throw new Error('PLATE_UNCHANGED');
    const[used]:any=await conn.query('SELECT id FROM character_vehicles WHERE plate=? AND id<>? LIMIT 1',[normalizedPlate,vehicleId]);
    if(used[0])throw new Error('PLATE_TAKEN');
    if(normalizedCost>0)await changeBalance(characterId,'bank',-normalizedCost,'dmv_plate',`vehicle:${vehicleId}`,conn);
    await conn.query('UPDATE character_vehicles SET plate=? WHERE id=?',[normalizedPlate,vehicleId]);
    await conn.query('INSERT INTO dmv_history(character_id,vehicle_id,action,value,cost) VALUES(?,?,?,?,?)',[characterId,vehicleId,'plate',normalizedPlate,normalizedCost]);
    await conn.commit();
    return normalizedPlate;
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}

export async function getVehicleRegistration(vehicleId:number,characterId:number){const[rows]=await mysql.query('SELECT id,character_id,model,plate,vin,mileage,insurance_until,created_at FROM character_vehicles WHERE id=? AND character_id=? LIMIT 1',[vehicleId,characterId]);return(rows as any[])[0]??null;}
export async function getDmvHistory(characterId:number,limit=50){const safeLimit=Math.max(1,Math.min(100,Math.trunc(Number(limit)||50)));const[rows]=await mysql.query(`SELECT d.*,v.model,v.plate FROM dmv_history d JOIN character_vehicles v ON v.id=d.vehicle_id WHERE d.character_id=? ORDER BY d.created_at DESC LIMIT ${safeLimit}`,[characterId]);return rows as any[];}

export function registerDmvModule():void{
  mp.events.add('veloria:dmv:registration',async(player:PlayerMp,rawVehicleId:number)=>{
    const id=characterId(player);if(!id)return;
    try{const data=await getVehicleRegistration(Math.trunc(Number(rawVehicleId)),id);if(!data)throw new Error('VEHICLE_NOT_OWNED');player.call('veloria:dmv:registration',[JSON.stringify(data)]);}catch{player.call('veloria:notify',['error','Транспорт не найден']);}
  });
  mp.events.add('veloria:dmv:history',async(player:PlayerMp)=>{
    const id=characterId(player);if(!id)return;
    try{player.call('veloria:dmv:history',[JSON.stringify(await getDmvHistory(id))]);}catch{player.call('veloria:notify',['error','Не удалось загрузить историю DMV']);}
  });
  mp.events.add('veloria:dmv:plate',async(player:PlayerMp,rawVehicleId:number,rawPlate:string)=>{
    const id=characterId(player);if(!id)return;
    try{const plate=await changePlate(id,Math.trunc(Number(rawVehicleId)),String(rawPlate??''));player.call('veloria:dmv:plateChanged',[Math.trunc(Number(rawVehicleId)),plate]);player.call('veloria:notify',['success',`Новый номер: ${plate}`]);}
    catch(error){const code=error instanceof Error?error.message:'';const message=code==='INVALID_PLATE'?'Номер должен содержать 3–8 букв/цифр':code==='PLATE_TAKEN'?'Этот номер уже занят':code==='INSUFFICIENT_FUNDS'?'Недостаточно средств':code==='PLATE_UNCHANGED'?'Этот номер уже установлен':'Не удалось сменить номер';player.call('veloria:notify',['error',message]);}
  });
}
