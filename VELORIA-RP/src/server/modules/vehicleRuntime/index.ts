import { mysql } from '../../core/mysql';
import { getGarageVehicles, parkVehicle, takeVehicle } from '../garages';

function characterId(player: PlayerMp): number | null {
  const value = player.getVariable('veloria:characterId') ?? player.getVariable('characterId');
  return typeof value === 'number' ? value : null;
}

function vec(raw: unknown, fallback: Vector3): Vector3 {
  if (!raw || typeof raw !== 'object') return fallback;
  const source = raw as Partial<Vector3>;
  return new mp.Vector3(
    Number(source.x ?? fallback.x),
    Number(source.y ?? fallback.y),
    Number(source.z ?? fallback.z)
  );
}

async function garageSpawn(garageId: number): Promise<Record<string, unknown>> {
  const [rows] = await mysql.query('SELECT spawn_json FROM garages WHERE id=? LIMIT 1', [garageId]);
  const row = (rows as any[])[0];
  if (!row) throw new Error('GARAGE_NOT_FOUND');
  try {
    const parsed = typeof row.spawn_json === 'string' ? JSON.parse(row.spawn_json) : (row.spawn_json ?? {});
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function notifyError(player:PlayerMp,error:unknown,fallback:string){
  const code=error instanceof Error?error.message:'';
  const messages:Record<string,string>={
    GARAGE_NOT_FOUND:'Гараж не найден',
    GARAGE_FULL:'В гараже нет свободных мест',
    VEHICLE_NOT_OWNED:'Автомобиль вам не принадлежит',
    VEHICLE_NOT_IN_GARAGE:'Автомобиль уже выдан из гаража',
    VEHICLE_IMPOUNDED:'Автомобиль находится на штрафстоянке',
    VEHICLE_LISTED:'Снимите автомобиль с продажи перед парковкой'
  };
  player.call('veloria:notify',['error',messages[code]??fallback]);
}

export function registerVehicleRuntimeModule(): void {
  mp.events.add('veloria:garage:list', async (player: PlayerMp, rawGarageId: number) => {
    const id = characterId(player);
    if (!id) return;
    try {
      const garageId = Math.trunc(Number(rawGarageId));
      if(garageId<=0)throw new Error('GARAGE_NOT_FOUND');
      const vehicles = await getGarageVehicles(id, garageId);
      player.call('veloria:garage:data', [garageId, JSON.stringify(vehicles)]);
    } catch (error) {
      notifyError(player,error,'Не удалось загрузить гараж');
    }
  });

  mp.events.add('veloria:garage:take', async (player: PlayerMp, rawVehicleId: number, rawGarageId: number) => {
    const id = characterId(player);
    if (!id) return;
    const vehicleId = Math.trunc(Number(rawVehicleId));
    const garageId = Math.trunc(Number(rawGarageId));
    if(vehicleId<=0||garageId<=0)return;

    let vehicle:VehicleMp|null=null;
    try {
      const [rows] = await mysql.query('SELECT * FROM character_vehicles WHERE id=? AND character_id=? LIMIT 1',[vehicleId,id]);
      const data = (rows as any[])[0];
      if (!data) throw new Error('VEHICLE_NOT_OWNED');

      const spawn = await garageSpawn(garageId);
      await takeVehicle(vehicleId,id,garageId);
      const position = vec(spawn, player.position);
      try{
        vehicle = mp.vehicles.new(data.model, position, {
          heading: Number(spawn.heading ?? 0),
          numberPlate: String(data.plate ?? 'VELORIA'),
          locked: Boolean(data.locked),
          engine: Boolean(data.engine_on),
          dimension: player.dimension
        });
        vehicle.setVariable('veloria:vehicleId', vehicleId);
        (vehicle as any).veloriaVehicleId = vehicleId;
      }catch(spawnError){
        await parkVehicle(vehicleId,id,garageId);
        throw spawnError;
      }
      player.call('veloria:notify', ['success', `Автомобиль ${data.plate} выдан из гаража`]);
    } catch (error) {
      if(vehicle){try{vehicle.destroy();}catch{}}
      notifyError(player,error,'Не удалось выдать автомобиль');
    }
  });

  mp.events.add('veloria:garage:park', async (player: PlayerMp, rawGarageId: number) => {
    const id = characterId(player);
    if (!id) return;
    const vehicle = player.vehicle;
    if (!vehicle) return;
    const vehicleId = Math.trunc(Number((vehicle as any).veloriaVehicleId ?? vehicle.getVariable('veloria:vehicleId') ?? 0));
    const garageId=Math.trunc(Number(rawGarageId));
    if (!vehicleId||garageId<=0) return;

    try {
      await parkVehicle(vehicleId, id, garageId);
      vehicle.destroy();
      player.call('veloria:notify', ['success', 'Автомобиль припаркован']);
    } catch (error) {
      notifyError(player,error,'Не удалось припарковать автомобиль');
    }
  });
}
