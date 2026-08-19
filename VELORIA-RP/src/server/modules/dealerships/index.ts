import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';
import { createOwnedVehicle } from '../vehicles';

export async function getDealershipStock(dealershipId:number){
  const[rows]=await mysql.query('SELECT * FROM dealership_stock WHERE dealership_id=? AND stock>0 ORDER BY price',[dealershipId]);
  return rows as any[];
}

export async function buyDealershipVehicle(characterId:number,stockId:number){
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]:any=await conn.query('SELECT * FROM dealership_stock WHERE id=? FOR UPDATE',[stockId]);
    const car=rows[0];
    if(!car||car.stock<=0)throw new Error('OUT_OF_STOCK');
    await changeBalance(characterId,'bank',-Number(car.price),'vehicle_purchase',`dealership:${car.dealership_id}`,conn);
    const plate=`VL${Math.floor(1000+Math.random()*9000)}`;
    const created=await createOwnedVehicle(characterId,car.model,plate,undefined,conn);
    await conn.query('UPDATE dealership_stock SET stock=stock-1 WHERE id=?',[stockId]);
    await conn.query('INSERT INTO vehicle_owner_history(vehicle_id,from_character_id,to_character_id,price,reason) VALUES(?,NULL,?,?,?)',[created.id,characterId,Number(car.price),'dealership']);
    await conn.commit();
    return{...created,model:car.model,plate};
  }catch(e){
    await conn.rollback();
    throw e;
  }finally{
    conn.release();
  }
}
