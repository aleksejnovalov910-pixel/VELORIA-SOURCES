import { mysql } from '../../core/mysql';

export type InventorySlot={slot:number;item:string;amount:number;metadata:Record<string,unknown>};
export type ItemDefinition={id:string;name:string;weight:number;stack:number;category:string;usable?:boolean};
export const ITEMS:Record<string,ItemDefinition>={water:{id:'water',name:'Вода',weight:0.5,stack:10,category:'food',usable:true},food:{id:'food',name:'Еда',weight:0.4,stack:10,category:'food',usable:true},medkit:{id:'medkit',name:'Аптечка',weight:0.8,stack:5,category:'medical',usable:true},phone:{id:'phone',name:'Телефон',weight:0.3,stack:1,category:'device'},vehicle_key:{id:'vehicle_key',name:'Ключ от автомобиля',weight:0.05,stack:1,category:'key'}};

function parseMetadata(value:unknown):Record<string,unknown>{
  if(!value)return{};
  if(typeof value==='object')return value as Record<string,unknown>;
  if(typeof value!=='string')return{};
  try{const parsed=JSON.parse(value);return parsed&&typeof parsed==='object'?parsed as Record<string,unknown>:{};}catch{return{};}
}
function canonical(value:unknown):unknown{
  if(Array.isArray(value))return value.map(canonical);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,canonical(v)]));
  return value;
}
function metadataJson(value:unknown):string{return JSON.stringify(canonical(value??{}));}
function validSlot(slot:number):boolean{return Number.isInteger(slot)&&slot>=0&&slot<40;}

export async function getInventory(characterId:number):Promise<InventorySlot[]>{
  const[rows]=await mysql.query('SELECT slot,item,amount,metadata_json FROM character_inventory WHERE character_id=? ORDER BY slot',[characterId]);
  return(rows as any[]).map(r=>({slot:Number(r.slot),item:String(r.item),amount:Number(r.amount),metadata:parseMetadata(r.metadata_json)}));
}

export async function saveSlot(characterId:number,slot:InventorySlot):Promise<void>{
  const normalizedSlot=Math.trunc(Number(slot.slot));
  const amount=Math.trunc(Number(slot.amount));
  const def=ITEMS[slot.item];
  if(!validSlot(normalizedSlot))throw new Error('INVALID_SLOT');
  if(!def)throw new Error('UNKNOWN_ITEM');
  if(amount<=0)return removeSlot(characterId,normalizedSlot);
  if(!Number.isSafeInteger(amount)||amount>def.stack)throw new Error('INVALID_AMOUNT');
  await mysql.query(`INSERT INTO character_inventory(character_id,slot,item,amount,metadata_json) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE item=VALUES(item),amount=VALUES(amount),metadata_json=VALUES(metadata_json)`,[characterId,normalizedSlot,slot.item,amount,metadataJson(slot.metadata)]);
}

export async function removeSlot(characterId:number,slot:number):Promise<void>{
  const normalizedSlot=Math.trunc(Number(slot));
  if(!validSlot(normalizedSlot))throw new Error('INVALID_SLOT');
  await mysql.query('DELETE FROM character_inventory WHERE character_id=? AND slot=?',[characterId,normalizedSlot]);
}

export async function getInventoryWeight(characterId:number){
  const inv=await getInventory(characterId);
  return inv.reduce((sum,s)=>sum+(ITEMS[s.item]?.weight??0)*s.amount,0);
}

export async function moveItem(characterId:number,from:number,to:number){
  from=Math.trunc(Number(from));to=Math.trunc(Number(to));
  if(from===to)return;
  if(!validSlot(from)||!validSlot(to))throw new Error('INVALID_SLOT');
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]:any=await conn.query('SELECT * FROM character_inventory WHERE character_id=? AND slot IN (?,?) FOR UPDATE',[characterId,from,to]);
    const a=rows.find((r:any)=>Number(r.slot)===from);
    if(!a)throw new Error('EMPTY_SLOT');
    const b=rows.find((r:any)=>Number(r.slot)===to);
    await conn.query('DELETE FROM character_inventory WHERE character_id=? AND slot IN (?,?)',[characterId,from,to]);
    await conn.query('INSERT INTO character_inventory(character_id,slot,item,amount,metadata_json) VALUES(?,?,?,?,?)',[characterId,to,a.item,a.amount,a.metadata_json]);
    if(b)await conn.query('INSERT INTO character_inventory(character_id,slot,item,amount,metadata_json) VALUES(?,?,?,?,?)',[characterId,from,b.item,b.amount,b.metadata_json]);
    await conn.query('INSERT INTO inventory_logs(character_id,action,item,amount,details_json) VALUES(?,?,?,?,?)',[characterId,'move',String(a.item),Number(a.amount),JSON.stringify({from,to,swapped:Boolean(b)})]);
    await conn.commit();
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}

export async function addItem(characterId:number,item:string,amount=1,metadata:Record<string,unknown>={}){
  const def=ITEMS[item];
  const requested=Math.trunc(Number(amount));
  if(!def)throw new Error('UNKNOWN_ITEM');
  if(!Number.isSafeInteger(requested)||requested<=0)throw new Error('INVALID_AMOUNT');

  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]=await conn.query('SELECT slot,item,amount,metadata_json FROM character_inventory WHERE character_id=? ORDER BY slot FOR UPDATE',[characterId]);
    const inv=(rows as any[]).map(r=>({slot:Number(r.slot),item:String(r.item),amount:Number(r.amount),metadata:parseMetadata(r.metadata_json)}));
    const metaJson=metadataJson(metadata);

    let capacity=0;
    for(const s of inv){
      if(s.item===item&&metadataJson(s.metadata)===metaJson)capacity+=Math.max(0,def.stack-s.amount);
    }
    capacity+=(40-inv.length)*def.stack;
    if(capacity<requested)throw new Error('INVENTORY_FULL');

    let left=requested;
    for(const s of inv){
      if(s.item!==item||metadataJson(s.metadata)!==metaJson||s.amount>=def.stack)continue;
      const add=Math.min(left,def.stack-s.amount);
      await conn.query('UPDATE character_inventory SET amount=amount+? WHERE character_id=? AND slot=?',[add,characterId,s.slot]);
      left-=add;
      if(!left)break;
    }

    if(left>0){
      const occupied=new Set(inv.map(s=>s.slot));
      for(let slot=0;slot<40&&left>0;slot++){
        if(occupied.has(slot))continue;
        const add=Math.min(left,def.stack);
        await conn.query('INSERT INTO character_inventory(character_id,slot,item,amount,metadata_json) VALUES(?,?,?,?,?)',[characterId,slot,item,add,metaJson]);
        occupied.add(slot);
        left-=add;
      }
    }

    if(left)throw new Error('INVENTORY_FULL');
    await conn.query('INSERT INTO inventory_logs(character_id,action,item,amount,details_json) VALUES(?,?,?,?,?)',[characterId,'add',item,requested,metaJson]);
    await conn.commit();
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}

export async function removeItem(characterId:number,item:string,amount=1){
  if(!ITEMS[item])throw new Error('UNKNOWN_ITEM');
  const requested=Math.trunc(Number(amount));
  if(!Number.isSafeInteger(requested)||requested<=0)throw new Error('INVALID_AMOUNT');

  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]=await conn.query('SELECT slot,item,amount,metadata_json FROM character_inventory WHERE character_id=? AND item=? ORDER BY slot FOR UPDATE',[characterId,item]);
    const inv=(rows as any[]).map(r=>({slot:Number(r.slot),amount:Number(r.amount)}));
    if(inv.reduce((n,s)=>n+s.amount,0)<requested)throw new Error('NOT_ENOUGH_ITEMS');

    let left=requested;
    for(const s of inv){
      if(!left)break;
      const take=Math.min(left,s.amount);
      const next=s.amount-take;
      if(next<=0)await conn.query('DELETE FROM character_inventory WHERE character_id=? AND slot=?',[characterId,s.slot]);
      else await conn.query('UPDATE character_inventory SET amount=? WHERE character_id=? AND slot=?',[next,characterId,s.slot]);
      left-=take;
    }

    await conn.query('INSERT INTO inventory_logs(character_id,action,item,amount,details_json) VALUES(?,?,?,?,?)',[characterId,'remove',item,requested,'{}']);
    await conn.commit();
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}
