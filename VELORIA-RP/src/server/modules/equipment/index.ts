import { mysql } from '../../core/mysql';
export type EquipmentSlot='hat'|'glasses'|'mask'|'top'|'undershirt'|'pants'|'shoes'|'accessory'|'watch'|'bracelet';
const SLOTS:ReadonlySet<EquipmentSlot>=new Set(['hat','glasses','mask','top','undershirt','pants','shoes','accessory','watch','bracelet']);

function parseMetadata(value:unknown):Record<string,unknown>{
  if(!value)return{};
  if(typeof value==='object')return value as Record<string,unknown>;
  try{
    const parsed=JSON.parse(String(value));
    return parsed&&typeof parsed==='object'?parsed:{};
  }catch{return{};}
}

function assertSlot(slot:string):asserts slot is EquipmentSlot{
  if(!SLOTS.has(slot as EquipmentSlot))throw new Error('INVALID_EQUIPMENT_SLOT');
}

export async function getEquipment(characterId:number){
  const[rows]=await mysql.query('SELECT slot,item,metadata_json FROM character_equipment WHERE character_id=? ORDER BY slot',[characterId]);
  return(rows as any[]).map(r=>({slot:r.slot as EquipmentSlot,item:String(r.item),metadata:parseMetadata(r.metadata_json)}));
}

export async function equip(characterId:number,slot:EquipmentSlot,item:string,metadata:Record<string,unknown>={}){
  assertSlot(slot);
  const normalizedItem=String(item??'').trim().slice(0,100);
  if(!normalizedItem)throw new Error('INVALID_EQUIPMENT_ITEM');
  await mysql.query('INSERT INTO character_equipment(character_id,slot,item,metadata_json) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE item=VALUES(item),metadata_json=VALUES(metadata_json)',[characterId,slot,normalizedItem,JSON.stringify(metadata??{})]);
  await mysql.query('INSERT INTO inventory_logs(character_id,action,item,amount,details_json) VALUES(?,?,?,?,?)',[characterId,'equip',normalizedItem,1,JSON.stringify({slot})]);
}

export async function unequip(characterId:number,slot:EquipmentSlot){
  assertSlot(slot);
  const[rows]=await mysql.query('SELECT item FROM character_equipment WHERE character_id=? AND slot=? LIMIT 1',[characterId,slot]);
  const item=(rows as any[])[0]?.item;
  await mysql.query('DELETE FROM character_equipment WHERE character_id=? AND slot=?',[characterId,slot]);
  if(item)await mysql.query('INSERT INTO inventory_logs(character_id,action,item,amount,details_json) VALUES(?,?,?,?,?)',[characterId,'unequip',String(item),1,JSON.stringify({slot})]);
}

function characterId(player:PlayerMp):number|null{
  const value=player.getVariable('veloria:characterId')??player.getVariable('characterId');
  return typeof value==='number'?value:null;
}

export function registerEquipmentModule():void{
  mp.events.add('veloria:equipment:get',async(player:PlayerMp)=>{
    const id=characterId(player);if(!id)return;
    try{player.call('veloria:equipment:data',[JSON.stringify(await getEquipment(id))]);}
    catch{player.call('veloria:notify',['error','Не удалось загрузить экипировку']);}
  });

  mp.events.add('veloria:equipment:equip',async(player:PlayerMp,rawSlot:string,item:string,rawMetadata?:string)=>{
    const id=characterId(player);if(!id)return;
    try{
      const slot=String(rawSlot);
      assertSlot(slot);
      let metadata:Record<string,unknown>={};
      if(rawMetadata){try{metadata=parseMetadata(rawMetadata);}catch{metadata={};}}
      await equip(id,slot,item,metadata);
      player.call('veloria:equipment:data',[JSON.stringify(await getEquipment(id))]);
    }catch{player.call('veloria:notify',['error','Не удалось экипировать предмет']);}
  });

  mp.events.add('veloria:equipment:unequip',async(player:PlayerMp,rawSlot:string)=>{
    const id=characterId(player);if(!id)return;
    try{
      const slot=String(rawSlot);
      assertSlot(slot);
      await unequip(id,slot);
      player.call('veloria:equipment:data',[JSON.stringify(await getEquipment(id))]);
    }catch{player.call('veloria:notify',['error','Не удалось снять предмет']);}
  });
}
