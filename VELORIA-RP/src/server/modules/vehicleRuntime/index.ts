import { mysql } from '../../core/mysql';
import { getGarageVehicles, parkVehicle, takeVehicle } from '../garages';
import { addMileage, setVehicleState } from '../vehicles';

const telemetry = new Map<number,{x:number;y:number;z:number;at:number}>();
function characterId(player: PlayerMp): number | null {
  const value = player.getVariable('veloria:characterId') ?? player.getVariable('characterId');
  return typeof value === 'number' ? value : null;
}
function vec(raw: unknown, fallback: Vector3): Vector3 {
  if (!raw || typeof raw !== 'object') return fallback;
  const source = raw as Partial<Vector3>;
  return new mp.Vector3(Number(source.x ?? fallback.x),Number(source.y ?? fallback.y),Number(source.z ?? fallback.z));
}
async function garageSpawn(garageId: number): Promise<Record<string, unknown>> {
  const [rows] = await mysql.query('SELECT spawn_json FROM garages WHERE id=? LIMIT 1', [garageId]);
  const row = (rows as any[])[0]; if (!row) throw new Error('GARAGE_NOT_FOUND');
  try { const parsed = typeof row.spawn_json === 'string' ? JSON.parse(row.spawn_json) : (row.spawn_json ?? {}); return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {}; } catch { return {}; }
}
function notifyError(player:PlayerMp,error:unknown,fallback:string){
  const code=error instanceof Error?error.message:'';
  const messages:Record<string,string>={GARAGE_NOT_FOUND:'Гараж не найден',GARAGE_FULL:'В гараже нет свободных мест',VEHICLE_NOT_OWNED:'Автомобиль вам не принадлежит',VEHICLE_NOT_IN_GARAGE:'Автомобиль уже выдан из гаража',VEHICLE_IMPOUNDED:'Автомобиль находится на штрафстоянке',VEHICLE_LISTED:'Снимите автомобиль с продажи перед парковкой'};
  player.call('veloria:notify',['error',messages[code]??fallback]);
}
function runtimeVehicleId(vehicle:VehicleMp|null):number{return vehicle?Math.trunc(Number((vehicle as any).veloriaVehicleId??vehicle.getVariable('veloria:vehicleId')??0)):0;}
async function persistDrivingState(player:PlayerMp):Promise<void>{
  const cid=characterId(player),vehicle=player.vehicle;if(!cid||!vehicle)return;
  const vehicleId=runtimeVehicleId(vehicle);if(!vehicleId)return;
  const [rows]:any=await mysql.query('SELECT character_id FROM character_vehicles WHERE id=? LIMIT 1',[vehicleId]);
  if(Number(rows[0]?.character_id)!==cid)return;
  const now=Date.now(),pos=vehicle.position,last=telemetry.get(vehicleId);telemetry.set(vehicleId,{x:pos.x,y:pos.y,z:pos.z,at:now});
  const engineHealth=Math.max(0,Math.min(1000,Number((vehicle as any).engineHealth??1000)));
  const bodyHealth=Math.max(0,Math.min(1000,Number((vehicle as any).bodyHealth??1000)));
  await setVehicleState(vehicleId,{engineHealth,bodyHealth,position:{x:pos.x,y:pos.y,z:pos.z,heading:Number(vehicle.rotation?.z??0)}});
  if(!last)return;
  const elapsed=Math.max(1,(now-last.at)/1000);if(elapsed>30)return;
  const dx=pos.x-last.x,dy=pos.y-last.y,dz=pos.z-last.z,meters=Math.sqrt(dx*dx+dy*dy+dz*dz);
  if(!Number.isFinite(meters)||meters<1||meters>Math.max(250,elapsed*90))return;
  const km=Math.min(2,meters/1000);await addMileage(vehicleId,km);
}
function startVehicleTelemetry():void{
  setInterval(()=>{
    mp.players.forEach((player:PlayerMp)=>{if(!player.vehicle)return;void persistDrivingState(player).catch((error)=>console.error('[VELORIA] vehicle telemetry failed',error));});
  },10000);
}
export function registerVehicleRuntimeModule(): void {
  startVehicleTelemetry();
  mp.events.add('veloria:garage:list', async (player: PlayerMp, rawGarageId: number) => {
    const id = characterId(player); if (!id) return;
    try { const garageId = Math.trunc(Number(rawGarageId)); if(garageId<=0)throw new Error('GARAGE_NOT_FOUND'); const vehicles = await getGarageVehicles(id, garageId); player.call('veloria:garage:data', [garageId, JSON.stringify(vehicles)]); } catch (error) { notifyError(player,error,'Не удалось загрузить гараж'); }
  });
  mp.events.add('veloria:garage:take', async (player: PlayerMp, rawVehicleId: number, rawGarageId: number) => {
    const id = characterId(player); if (!id) return; const vehicleId = Math.trunc(Number(rawVehicleId)); const garageId = Math.trunc(Number(rawGarageId)); if(vehicleId<=0||garageId<=0)return;
    try {
      const [rows] = await mysql.query('SELECT * FROM character_vehicles WHERE id=? AND character_id=? LIMIT 1',[vehicleId,id]); const data = (rows as any[])[0]; if (!data) throw new Error('VEHICLE_NOT_OWNED');
      const spawn = await garageSpawn(garageId); await takeVehicle(vehicleId,id,garageId); const position = vec(spawn, player.position);
      try{
        const spawnedVehicle = mp.vehicles.new(data.model, position, {heading:Number(spawn.heading ?? 0),numberPlate:String(data.plate ?? 'VELORIA'),locked:Boolean(data.locked),engine:Boolean(data.engine_on),dimension:player.dimension});
        spawnedVehicle.setVariable('veloria:vehicleId', vehicleId); (spawnedVehicle as any).veloriaVehicleId = vehicleId; (spawnedVehicle as any).engineHealth=Number(data.engine_health??1000); (spawnedVehicle as any).bodyHealth=Number(data.body_health??1000);
      }catch(spawnError){await parkVehicle(vehicleId,id,garageId);throw spawnError;}
      player.call('veloria:notify', ['success', `Автомобиль ${data.plate} выдан из гаража`]);
    } catch (error) { notifyError(player,error,'Не удалось выдать автомобиль'); }
  });
  mp.events.add('veloria:garage:park', async (player: PlayerMp, rawGarageId: number) => {
    const id = characterId(player); if (!id) return; const vehicle = player.vehicle; if (!vehicle) return; const vehicleId=runtimeVehicleId(vehicle); const garageId=Math.trunc(Number(rawGarageId)); if (!vehicleId||garageId<=0) return;
    try { await persistDrivingState(player); await parkVehicle(vehicleId, id, garageId); telemetry.delete(vehicleId); vehicle.destroy(); player.call('veloria:notify', ['success', 'Автомобиль припаркован']); } catch (error) { notifyError(player,error,'Не удалось припарковать автомобиль'); }
  });
  mp.events.add('vehicleDeath',(vehicle:VehicleMp)=>{const id=runtimeVehicleId(vehicle);if(id)telemetry.delete(id);});
}
