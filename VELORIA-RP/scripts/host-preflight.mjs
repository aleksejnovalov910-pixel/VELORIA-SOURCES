import 'dotenv/config';

const required = ['MYSQL_HOST','MYSQL_PORT','MYSQL_USER','MYSQL_PASSWORD','MYSQL_DATABASE','REDIS_HOST','REDIS_PORT'];
const missing = required.filter(key => !String(process.env[key] ?? '').trim());
if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);

const forbidden = new Set(['change_me','changeme','password','root','example']);
const mysqlPassword = String(process.env.MYSQL_PASSWORD ?? '').trim().toLowerCase();
if (forbidden.has(mysqlPassword)) throw new Error('MYSQL_PASSWORD still uses an unsafe placeholder value');

const mysqlPort = Number(process.env.MYSQL_PORT);
const redisPort = Number(process.env.REDIS_PORT);
if (!Number.isInteger(mysqlPort) || mysqlPort < 1 || mysqlPort > 65535) throw new Error('MYSQL_PORT must be a valid TCP port');
if (!Number.isInteger(redisPort) || redisPort < 1 || redisPort > 65535) throw new Error('REDIS_PORT must be a valid TCP port');

if (String(process.env.NODE_ENV ?? '').toLowerCase() !== 'production') {
  console.warn('Warning: NODE_ENV is not set to production');
}

console.log('VELORIA host environment preflight: OK');
