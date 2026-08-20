import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

const requiredTables = [
  'accounts','characters','character_inventory','inventory_logs','phone_numbers','phone_contacts','phone_messages','player_settings','character_vehicles','vehicle_rentals','garages','garage_vehicles','dealerships','dealership_stock','properties','businesses','factions','families','character_jobs','market_listings'
];

try {
  const [tables] = await connection.query(`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()`);
  const present = new Set(tables.map(row => row.TABLE_NAME));
  const missing = requiredTables.filter(name => !present.has(name));
  if (missing.length) throw new Error(`Missing runtime tables: ${missing.join(', ')}`);

  const [columns] = await connection.query(`SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accounts'`);
  const accountColumns = new Set(columns.map(row => row.COLUMN_NAME));
  for (const name of ['id','username','password_hash','created_at','last_login_at']) if (!accountColumns.has(name)) throw new Error(`accounts.${name} is missing`);

  const [garageSeedRows] = await connection.query('SELECT id,name,slots,position_json,spawn_json FROM garages WHERE id IN (1,2,3,4) ORDER BY id');
  if (garageSeedRows.length !== 4) throw new Error('Public garage seed is incomplete');
  const [dealerRows] = await connection.query('SELECT id,name,position_json,spawn_json FROM dealerships WHERE id IN (1,2) ORDER BY id');
  if (dealerRows.length !== 2) throw new Error('Dealership seed is incomplete');
  const [dealerStock] = await connection.query('SELECT dealership_id,COUNT(*) AS total,SUM(stock) AS stock FROM dealership_stock WHERE dealership_id IN (1,2) GROUP BY dealership_id');
  if (dealerStock.length !== 2 || dealerStock.some(row => Number(row.total) < 3 || Number(row.stock) <= 0)) throw new Error('Dealership stock seed is incomplete');

  await connection.beginTransaction();
  const username = `ci_smoke_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const [account] = await connection.execute('INSERT INTO accounts(username,password_hash,created_at,last_login_at) VALUES(?,?,NOW(),NOW())',[username,'ci-not-a-real-password-hash']);
  const accountId = Number(account.insertId);
  if (!Number.isSafeInteger(accountId) || accountId <= 0) throw new Error('Account insert did not return an id');
  const appearance = JSON.stringify({gender:'male',parents:{mother:21,father:0,shapeMix:0.5,skinMix:0.5},faceFeatures:{},hair:{style:0,color:0,highlight:0},eyeColor:0,eyebrows:{index:0,opacity:1,color:0},beard:{index:0,opacity:0,color:0},makeup:{index:0,opacity:0},blemishes:{index:0,opacity:0},ageing:{index:0,opacity:0},complexion:{index:0,opacity:0},sunDamage:{index:0,opacity:0},lipstick:{index:0,opacity:0},chestHair:{index:0,opacity:0},clothing:{}});
  const [character] = await connection.execute(`INSERT INTO characters (account_id,slot,first_name,last_name,level,cash,bank,appearance_json,pos_x,pos_y,pos_z,heading,created_at) VALUES(?,1,'Ci','Smoke',1,5000,10000,?,-1037.72,-2737.88,20.17,330,NOW())`,[accountId,appearance]);
  const characterId = Number(character.insertId);
  if (!Number.isSafeInteger(characterId) || characterId <= 0) throw new Error('Character insert did not return an id');
  await connection.execute('UPDATE accounts SET last_login_at=NOW() WHERE id=?',[accountId]);
  await connection.execute("INSERT INTO character_inventory(character_id,slot,item,amount,metadata_json) VALUES(?,0,'phone',1,'{}'),(?,1,'cloth',4,'{}'),(?,2,'scrap',5,'{}'),(?,3,'metal',4,'{}')",[characterId,characterId,characterId,characterId]);
  await connection.execute('INSERT INTO player_settings(character_id,ui_json) VALUES(?,?)',[characterId,JSON.stringify({hud:true,minimap:true})]);
  await connection.execute(`INSERT INTO vehicle_rentals(character_id,model,plate,price,started_at,expires_at,active) VALUES(?, 'blista', 'CISMOKE', 500, NOW(), DATE_ADD(NOW(), INTERVAL 30 MINUTE), 1)`,[characterId]);
  const [vehicle] = await connection.execute(`INSERT INTO character_vehicles(character_id,model,plate,fuel,engine_health,body_health,locked,engine_on) VALUES(?, 'blista', ?, 100, 1000, 1000, 1, 0)`,[characterId,`CI${String(Date.now()).slice(-8)}`]);
  const vehicleId = Number(vehicle.insertId);
  if (!Number.isSafeInteger(vehicleId) || vehicleId <= 0) throw new Error('Vehicle insert did not return an id');
  await connection.execute('INSERT INTO garage_vehicles(vehicle_id,garage_id,parked_at) VALUES(?,1,NOW())',[vehicleId]);

  const [rows] = await connection.query('SELECT id,account_id,slot,appearance_json,pos_x,pos_y,pos_z,heading FROM characters WHERE id=?',[characterId]);
  if (rows.length !== 1) throw new Error('Inserted character cannot be loaded');
  const [rentalRows] = await connection.query('SELECT model,plate,active,expires_at FROM vehicle_rentals WHERE character_id=?',[characterId]);
  if (rentalRows.length !== 1 || Number(rentalRows[0].active) !== 1) throw new Error('Vehicle rental state cannot be loaded');
  const [garageVehicleRows] = await connection.query(`SELECT gv.vehicle_id,gv.garage_id,v.character_id,v.model,v.plate FROM garage_vehicles gv JOIN character_vehicles v ON v.id=gv.vehicle_id WHERE gv.vehicle_id=? AND gv.garage_id=1`,[vehicleId]);
  if (garageVehicleRows.length !== 1 || Number(garageVehicleRows[0].character_id) !== characterId) throw new Error('Garage vehicle state cannot be loaded');
  const [materialRows] = await connection.query(`SELECT item,SUM(amount) AS total FROM character_inventory WHERE character_id=? AND item IN ('cloth','scrap','metal') GROUP BY item`,[characterId]);
  const materialMap = new Map(materialRows.map(row => [String(row.item),Number(row.total)]));
  if (materialMap.get('cloth') !== 4 || materialMap.get('scrap') !== 5 || materialMap.get('metal') !== 4) throw new Error('Crafting material inventory state cannot be loaded');

  await connection.rollback();
  console.log(`VELORIA DB runtime smoke OK (${requiredTables.length} required tables)`);
} catch (error) {
  try { await connection.rollback(); } catch {}
  throw error;
} finally { await connection.end(); }
