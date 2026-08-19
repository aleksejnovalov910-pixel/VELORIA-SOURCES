import { mysql } from '../../core/mysql';
export async function getAdminLevel(accountId:number){ const [rows]=await mysql.query('SELECT admin_level FROM accounts WHERE id=? LIMIT 1',[accountId]); return Number((rows as any[])[0]?.admin_level ?? 0); }
export async function logAdmin(accountId:number,action:string,target:string,details:unknown){ await mysql.query('INSERT INTO admin_logs(account_id,action,target,details_json,created_at) VALUES(?,?,?,?,NOW())',[accountId,action,target,JSON.stringify(details ?? {})]); }
