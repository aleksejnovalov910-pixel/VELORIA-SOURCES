import { getCharacterVehicles } from '../vehicles';
import { getOwnedProperties } from '../property';
import { getJob } from '../jobs';
import { getFamilyByCharacter, getFamilyMembers } from '../families';
import { getFactionByCharacter, getFactionMembers } from '../factions';
function characterId(player:PlayerMp){const id=player.getVariable('veloria:characterId');return typeof id==='number'?id:null}
export function registerTabletModule(){mp.events.add('veloria:tablet:data',async(player:PlayerMp,section:string)=>{const id=characterId(player);if(!id)return;try{let data:unknown=null;if(section==='transport')data=await getCharacterVehicles(id);else if(section==='property')data=await getOwnedProperties(id);else if(section==='job')data=await getJob(id);else if(section==='family'){const family=await getFamilyByCharacter(id);data=family?{family,members:await getFamilyMembers(family.id)}:null}else if(section==='faction'){const faction=await getFactionByCharacter(id);data=faction?{faction,members:await getFactionMembers(faction.id)}:null}else return;player.call('veloria:tablet:data',[section,JSON.stringify(data)])}catch{player.call('veloria:notify',['error','Не удалось загрузить данные планшета'])}})}
