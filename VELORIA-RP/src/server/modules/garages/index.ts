import { mysql } from '../../core/mysql';

export async function getGarageVehicles(characterId:number,garageId:number){
  const id=Math.trunc(Number(garageId));
  if(id<=0)throw new Error('INVALID_GARAGE');
  const[rows]=await mysql.query(
    'SELECT v.* FROM character_vehicles v JOIN garage_vehicles gv ON gv.vehicle_id=v.id WHERE v.character_id=? AND gv.garage_id=? ORDER BY gv.parked_at DESC',
    [characterId,id]
  );
  return rows as any[];
}

export async function parkVehicle(vehicleId:number,characterId:number,garageId:number){
  const id=Math.trunc(Number(garageId));
  if(id<=0)throw new Error('INVALID_GARAGE');
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[garageRows]:any=await conn.query('SELECT id,slots FROM garages WHERE id=? FOR UPDATE',[id]);
    const garage=garageRows[0];
    if(!garage)throw new Error('GARAGE_NOT_FOUND');

    const[vehicleRows]:any=await conn.query('SELECT id FROM character_vehicles WHERE id=? AND character_id=? FOR UPDATE',[vehicleId,characterId]);
    if(!vehicleRows[0])throw new Error('VEHICLE_NOT_OWNED');

    const[impoundRows]:any=await conn.query('SELECT 1 FROM impound_vehicles WHERE vehicle_id=? LIMIT 1',[vehicleId]);
    if(impoundRows[0])throw new Error('VEHICLE_IMPOUNDED');

    const[marketRows]:any=await conn.query('SELECT 1 FROM vehicle_market WHERE vehicle_id=? LIMIT 1',[vehicleId]);
    if(marketRows[0])throw new Error('VEHICLE_LISTED');

    const[countRows]:any=await conn.query('SELECT COUNT(*) AS total FROM garage_vehicles WHERE garage_id=? AND vehicle_id<>?',[id,vehicleId]);
    const slots=Math.max(0,Math.trunc(Number(garage.slots)||0));
    if(slots>0&&Number(countRows[0]?.total??0)>=slots)throw new Error('GARAGE_FULL');

    await conn.query(
      'INSERT INTO garage_vehicles(vehicle_id,garage_id,parked_at) VALUES(?,?,NOW()) ON DUPLICATE KEY UPDATE garage_id=VALUES(garage_id),parked_at=NOW()',
      [vehicleId,id]
    );
    await conn.commit();
    return true;
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}

export async function takeVehicle(vehicleId:number,characterId:number,garageId?:number){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const params:any[]=[vehicleId,characterId];
    let sql='SELECT gv.vehicle_id,gv.garage_id FROM garage_vehicles gv JOIN character_vehicles v ON v.id=gv.vehicle_id WHERE gv.vehicle_id=? AND v.character_id=?';
    if(garageId!==undefined){sql+=' AND gv.garage_id=?';params.push(Math.trunc(Number(garageId)));}
    sql+=' FOR UPDATE';
    const[rows]:any=await conn.query(sql,params);
    if(!rows[0])throw new Error('VEHICLE_NOT_IN_GARAGE');
    const[impoundRows]:any=await conn.query('SELECT 1 FROM impound_vehicles WHERE vehicle_id=? LIMIT 1',[vehicleId]);
    if(impoundRows[0])throw new Error('VEHICLE_IMPOUNDED');
    await conn.query('DELETE FROM garage_vehicles WHERE vehicle_id=?',[vehicleId]);
    await conn.commit();
    return true;
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}
