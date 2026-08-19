import { mysql } from '../../core/mysql';
export async function startJob(characterId:number,job:string){ await mysql.query('INSERT INTO character_jobs(character_id,job_name,started_at,progress_json) VALUES(?,?,NOW(),?) ON DUPLICATE KEY UPDATE job_name=VALUES(job_name),started_at=NOW(),progress_json=VALUES(progress_json)',[characterId,job,JSON.stringify({})]); }
export async function stopJob(characterId:number){ await mysql.query('DELETE FROM character_jobs WHERE character_id=?',[characterId]); }
export async function getJob(characterId:number){ const [rows]=await mysql.query('SELECT * FROM character_jobs WHERE character_id=? LIMIT 1',[characterId]); return (rows as any[])[0] ?? null; }
