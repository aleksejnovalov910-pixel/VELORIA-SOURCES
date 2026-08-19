import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';

export async function impoundVehicle(vehicleId:number,reason:string,fine:number,staffCharacterId:number|null=null){
  const normalizedFine=Math.max(0,Math.trunc(Number(fine)||0));
  const normalizedReason=String(reason??'').trim().slice(0,255) || 'Без причины';
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[vehicleRows]:any=await conn.query('SELECT id FROM character_vehicles WHERE id=? FOR UPDATE',[vehicleId]);
    if(!vehicleRows[0])throw new Error('VEHICLE_NOT_FOUND');
    await conn.query('DELETE FROM vehicle_market WHERE vehicle_id=?',[vehicleId]);
    await conn.query('DELETE FROM garage_vehicles WHERE vehicle_id=?',[vehicleId]);
    await conn.query('INSERT INTO impound_vehicles(vehicle_id,reason,fine,impounded_by) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE reason=VALUES(reason),fine=VALUES(fine),impounded_by=VALUES(impounded_by),created_at=CURRENT_TIMESTAMP',[vehicleId,normalizedReason,normalizedFine,staffCharacterId]);
    await conn.commit();
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}

export async function getImpoundedVehicles(characterId:number){
  const[rows]=await mysql.query('SELECT i.*,v.model,v.plate,v.vin FROM impound_vehicles i JOIN character_vehicles v ON v.id=i.vehicle_id WHERE v.character_id=? ORDER BY i.created_at DESC',[characterId]);
  return rows as any[];
}

export async function releaseVehicle(vehicleId:number,characterId:number){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]:any=await conn.query('SELECT i.fine FROM impound_vehicles i JOIN character_vehicles v ON v.id=i.vehicle_id WHERE i.vehicle_id=? AND v.character_id=? FOR UPDATE',[vehicleId,characterId]);
    const row=rows[0];
    if(!row)throw new Error('NOT_IMPOUNDED');
    const fine=Math.max(0,Math.trunc(Number(row.fine)||0));
    if(fine>0)await changeBalance(characterId,'bank',-fine,'impound_release',`vehicle:${vehicleId}`,conn);
    await conn.query('DELETE FROM impound_vehicles WHERE vehicle_id=?',[vehicleId]);
    await conn.commit();
    return true;
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}
