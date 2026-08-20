import mysql from 'mysql2/promise';
import Redis from 'ioredis';

function envFlag(name, fallback = false) {
  const raw = String(process.env[name] ?? '').trim().toLowerCase();
  if (!raw) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(raw);
}

const mysqlConfig = {
  host: process.env.MYSQL_HOST ?? '127.0.0.1',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'veloria',
  password: process.env.MYSQL_PASSWORD ?? '',
  database: process.env.MYSQL_DATABASE ?? 'veloria',
  connectTimeout: 5000
};

const redisEnabled = envFlag('REDIS_ENABLED', false);
const redisRequired = envFlag('REDIS_REQUIRED', false);
const redisConfig = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  lazyConnect: true,
  connectTimeout: 5000,
  maxRetriesPerRequest: 1,
  retryStrategy: () => null
};

let db;
let redis;
try {
  db = await mysql.createConnection(mysqlConfig);
  const [rows] = await db.query('SELECT 1 AS ok');
  if (!Array.isArray(rows)) throw new Error('MySQL smoke query returned an unexpected result');
  console.log('MySQL dependency smoke: OK');

  if (!redisEnabled) {
    console.log('Redis dependency smoke: SKIPPED (REDIS_ENABLED=false)');
  } else {
    try {
      redis = new Redis(redisConfig);
      await redis.connect();
      const pong = await redis.ping();
      if (pong !== 'PONG') throw new Error(`Unexpected Redis PING response: ${pong}`);
      console.log('Redis dependency smoke: OK');
    } catch (error) {
      if (redisRequired) throw error;
      console.warn(`Redis dependency smoke: OPTIONAL/UNAVAILABLE (${error instanceof Error ? error.message : String(error)})`);
    }
  }
} finally {
  if (db) await db.end().catch(() => undefined);
  if (redis) redis.disconnect();
}
