import { mysql } from '../../core/mysql';
import { changeBalance } from '../banking';

const normalizeJobName=(value:string)=>String(value??'').trim().slice(0,64);
function characterId(player:PlayerMp):number|null{const value=player.getVariable('veloria:characterId')??player.getVariable('characterId');return typeof value==='number'?value:null;}

export async function startJob(characterId:number,job:string){
  const jobName=normalizeJobName(job);if(!jobName)throw new Error('INVALID_JOB');
  await mysql.query('INSERT INTO character_jobs(character_id,job_name,started_at,progress_json) VALUES(?,?,NOW(),?) ON DUPLICATE KEY UPDATE job_name=VALUES(job_name),started_at=NOW(),progress_json=VALUES(progress_json)',[characterId,jobName,JSON.stringify({completed:0,earned:0})]);
}
export async function stopJob(characterId:number){await mysql.query('DELETE FROM character_jobs WHERE character_id=?',[characterId]);}
export async function getJob(characterId:number){const[rows]=await mysql.query('SELECT * FROM character_jobs WHERE character_id=? LIMIT 1',[characterId]);return(rows as any[])[0]??null;}
export async function completeJobStep(characterId:number,reward:number,details:Record<string,unknown>={}){
  const normalizedReward=Math.trunc(Number(reward));if(!Number.isFinite(normalizedReward)||normalizedReward<0)throw new Error('INVALID_REWARD');
  const conn=await mysql.getConnection();
  try{
    await conn.beginTransaction();
    const[rows]:any=await conn.query('SELECT * FROM character_jobs WHERE character_id=? FOR UPDATE',[characterId]);const job=rows[0];if(!job)throw new Error('JOB_NOT_ACTIVE');
    let progress:Record<string,any>={};try{progress=job.progress_json?(typeof job.progress_json==='string'?JSON.parse(job.progress_json):job.progress_json):{};}catch{progress={};}
    progress.completed=Math.max(0,Number(progress.completed??0))+1;progress.earned=Math.max(0,Number(progress.earned??0))+normalizedReward;progress.last=details??{};
    await conn.query('UPDATE character_jobs SET progress_json=? WHERE character_id=?',[JSON.stringify(progress),characterId]);
    if(normalizedReward>0)await changeBalance(characterId,'cash',normalizedReward,'job_reward',String(job.job_name),conn);
    await conn.query('INSERT INTO job_history(character_id,job_name,reward,details_json) VALUES(?,?,?,?)',[characterId,String(job.job_name).slice(0,64),normalizedReward,JSON.stringify(details??{})]);
    await conn.commit();return progress;
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
}

export function registerJobsModule():void{
  mp.events.add('veloria:job:get',async(player:PlayerMp)=>{const id=characterId(player);if(!id)return;try{player.call('veloria:job:data',[JSON.stringify(await getJob(id))]);}catch{player.call('veloria:notify',['error','Не удалось загрузить работу']);}});
  mp.events.add('veloria:job:start',async(player:PlayerMp,job:string)=>{const id=characterId(player);if(!id)return;try{await startJob(id,String(job));player.call('veloria:job:data',[JSON.stringify(await getJob(id))]);player.call('veloria:notify',['success','Работа начата']);}catch(error){player.call('veloria:notify',['error',error instanceof Error?error.message:'Не удалось начать работу']);}});
  mp.events.add('veloria:job:stop',async(player:PlayerMp)=>{const id=characterId(player);if(!id)return;try{await stopJob(id);player.call('veloria:job:data',['null']);player.call('veloria:notify',['success','Работа завершена']);}catch{player.call('veloria:notify',['error','Не удалось завершить работу']);}});
}
