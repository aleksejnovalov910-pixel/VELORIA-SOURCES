import 'dotenv/config';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

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

const root = process.cwd();
const runtimeFiles = [
  'conf.json',
  'package.json',
  'packages/veloria/index.js',
  'packages/veloria/server/index.js',
  'client_packages/index.js',
  'client_packages/veloria/index.html',
  'client_packages/veloria/runtime/client/index.js',
  'scripts/migrate.mjs',
  'scripts/dependency-smoke.mjs'
];

for (const relative of runtimeFiles) {
  try {
    await access(resolve(root, relative), constants.R_OK);
  } catch {
    throw new Error(`Missing or unreadable runtime file: ${relative}`);
  }
}

let conf;
try {
  conf = JSON.parse(await readFile(resolve(root, 'conf.json'), 'utf8'));
} catch (error) {
  throw new Error(`conf.json is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
}

if (conf.name !== 'VELORIA RP') throw new Error('conf.json name must be "VELORIA RP"');
if (conf.gamemode !== 'roleplay') throw new Error('conf.json gamemode must be "roleplay"');
if (conf.language !== 'ru') throw new Error('conf.json language must be "ru"');
if (conf.bind !== '0.0.0.0') throw new Error('conf.json bind must be "0.0.0.0" for hosting');
if (!Number.isInteger(conf.port) || conf.port < 1 || conf.port > 65535) throw new Error('conf.json port must be a valid TCP/UDP port');
if (conf.maxplayers !== 500) throw new Error('conf.json maxplayers must remain 500');

console.log(`VELORIA host environment preflight: OK (server=${conf.name}, port=${conf.port}, slots=${conf.maxplayers})`);
