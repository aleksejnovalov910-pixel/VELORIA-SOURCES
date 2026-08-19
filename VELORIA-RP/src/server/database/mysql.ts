import mysql, { Pool } from 'mysql2/promise';
import { logger } from '../core/logger';

let pool: Pool | null = null;

export async function initMySql(): Promise<Pool> {
  if (pool) return pool;

  const nextPool = mysql.createPool({
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'veloria',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'veloria',
    connectionLimit: 20,
    waitForConnections: true,
    connectTimeout: 5000,
    charset: 'utf8mb4'
  });

  try {
    await nextPool.query('SELECT 1');
    pool = nextPool;
    logger.info('MySQL connected');
    return nextPool;
  } catch (error) {
    await nextPool.end().catch(() => undefined);
    logger.error('MySQL connection failed. Check MYSQL_HOST/MYSQL_PORT/MYSQL_USER/MYSQL_PASSWORD/MYSQL_DATABASE.', error);
    throw error;
  }
}

export function db(): Pool {
  if (!pool) throw new Error('MySQL has not been initialized');
  return pool;
}
