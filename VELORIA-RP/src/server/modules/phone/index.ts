import { mysql } from '../../core/mysql';

function getCharacterId(player:PlayerMp):number|null{
  const value=Number(player.getVariable('veloria:characterId')??player.getVariable('characterId'));
  return Number.isSafeInteger(value)&&value>0?value:null;
}
function normalizeNumber(value:unknown){return String(value??'').replace(/[^0-9+]/g,'').slice(0,16)}
function normalizeName(value:unknown){return String(value??'').trim().replace(/\s+/g,' ').slice(0,64)}
function notify(player:PlayerMp,type:'success'|'error',text:string){player.call('veloria:notify',[type,text])}

export async function ensurePhone(characterId:number):Promise<string>{
  const[rows]=await mysql.query('SELECT phone_number FROM phone_numbers WHERE character_id=? LIMIT 1',[characterId]);
  const existing=(rows as any[])[0];
  if(existing)return String(existing.phone_number);
  for(let i=0;i<20;i++){
    const n=`555${Math.floor(1000000+Math.random()*9000000)}`;
    try{await mysql.query('INSERT INTO phone_numbers(character_id,phone_number) VALUES(?,?)',[characterId,n]);return n}catch{}
  }
  throw new Error('PHONE_ALLOCATION_FAILED');
}

async function sendData(player:PlayerMp){
  const characterId=getCharacterId(player);if(!characterId)return;
  try{
    const number=await ensurePhone(characterId);
    const[contacts]=await mysql.query('SELECT id,phone_number AS number,display_name AS name FROM phone_contacts WHERE owner_character_id=? ORDER BY display_name,id',[characterId]);
    const[messages]=await mysql.query('SELECT id,sender_number AS `from`,receiver_number AS `to`,body AS text,created_at AS createdAt FROM phone_messages WHERE sender_number=? OR receiver_number=? ORDER BY id DESC LIMIT 100',[number,number]);
    player.call('veloria:phone:data',[JSON.stringify({number,contacts,messages})]);
  }catch{notify(player,'error','Телефон временно недоступен')}
}

export function registerPhoneModule():void{
  mp.events.add('veloria:phone:open',sendData);
  mp.events.add('veloria:phone:data',sendData);
  mp.events.add('veloria:phone:contact:add',async(player:PlayerMp,rawNumber:string,rawName:string)=>{
    const id=getCharacterId(player);if(!id)return;
    const number=normalizeNumber(rawNumber),name=normalizeName(rawName);
    if(number.length<7||!name)return notify(player,'error','Проверьте имя и номер контакта');
    try{
      const own=await ensurePhone(id);if(number===own)return notify(player,'error','Нельзя добавить собственный номер');
      await mysql.query('INSERT INTO phone_contacts(owner_character_id,phone_number,display_name) VALUES(?,?,?)',[id,number,name]);
      notify(player,'success','Контакт добавлен');await sendData(player);
    }catch{notify(player,'error','Не удалось добавить контакт')}
  });
  mp.events.add('veloria:phone:message:send',async(player:PlayerMp,receiverRaw:string,bodyRaw:string)=>{
    const id=getCharacterId(player);if(!id)return;
    const receiver=normalizeNumber(receiverRaw),body=String(bodyRaw??'').trim().slice(0,512);
    if(receiver.length<7||!body)return notify(player,'error','Введите номер и сообщение');
    try{
      const sender=await ensurePhone(id);
      if(sender===receiver)return notify(player,'error','Нельзя отправить сообщение самому себе');
      const[recipientRows]=await mysql.query('SELECT character_id FROM phone_numbers WHERE phone_number=? LIMIT 1',[receiver]);
      if(!(recipientRows as any[])[0])return notify(player,'error','Номер не существует');
      await mysql.query('INSERT INTO phone_messages(sender_number,receiver_number,body) VALUES(?,?,?)',[sender,receiver,body]);
      notify(player,'success','Сообщение отправлено');await sendData(player);
    }catch{notify(player,'error','Сообщение не отправлено')}
  });
}
