import { mysql } from '../../core/mysql';

function getCharacterId(player:PlayerMp):number|null{
  const v=player.getVariable('veloria:characterId');
  return typeof v==='number'?v:null;
}

export async function ensurePhone(characterId:number):Promise<string>{
  const[rows]=await mysql.query('SELECT phone_number FROM phone_numbers WHERE character_id=? LIMIT 1',[characterId]);
  const existing=(rows as any[])[0];
  if(existing)return String(existing.phone_number);
  for(let i=0;i<10;i++){
    const n=`555${Math.floor(1000000+Math.random()*9000000)}`;
    try{
      await mysql.query('INSERT INTO phone_numbers(character_id,phone_number) VALUES(?,?)',[characterId,n]);
      return n;
    }catch{}
  }
  throw new Error('Unable to allocate phone number');
}

async function sendData(player:PlayerMp){
  const characterId=getCharacterId(player);
  if(!characterId)return;
  try{
    const number=await ensurePhone(characterId);
    const[contacts]=await mysql.query('SELECT id,phone_number AS number,display_name AS name FROM phone_contacts WHERE owner_character_id=? ORDER BY display_name',[characterId]);
    const[messages]=await mysql.query('SELECT id,sender_number AS `from`,body AS text,created_at AS createdAt FROM phone_messages WHERE sender_number=? OR receiver_number=? ORDER BY id DESC LIMIT 100',[number,number]);
    player.call('veloria:phone:data',[JSON.stringify({number,contacts,messages})]);
  }catch{
    player.call('veloria:notify',['error','Телефон временно недоступен']);
  }
}

export function registerPhoneModule():void{
  mp.events.add('veloria:phone:open',sendData);
  mp.events.add('veloria:phone:data',sendData);
  mp.events.add('veloria:phone:contact:add',async(player:PlayerMp,rawNumber:string,rawName:string)=>{
    const id=getCharacterId(player);if(!id)return;
    const number=String(rawNumber??'').replace(/[^0-9+]/g,'').slice(0,16),name=String(rawName??'').trim().slice(0,64);
    if(!number||!name)return;
    await mysql.query('INSERT INTO phone_contacts(owner_character_id,phone_number,display_name) VALUES(?,?,?)',[id,number,name]);
    player.call('veloria:notify',['success','Контакт добавлен']);
    await sendData(player);
  });
  mp.events.add('veloria:phone:message:send',async(player:PlayerMp,receiverRaw:string,bodyRaw:string)=>{
    const id=getCharacterId(player);if(!id)return;
    const receiver=String(receiverRaw??'').replace(/[^0-9+]/g,'').slice(0,16),body=String(bodyRaw??'').trim().slice(0,512);
    if(!receiver||!body)return;
    try{
      const sender=await ensurePhone(id);
      await mysql.query('INSERT INTO phone_messages(sender_number,receiver_number,body) VALUES(?,?,?)',[sender,receiver,body]);
      player.call('veloria:notify',['success','Сообщение отправлено']);
      await sendData(player);
    }catch{
      player.call('veloria:notify',['error','Сообщение не отправлено']);
    }
  });
}
