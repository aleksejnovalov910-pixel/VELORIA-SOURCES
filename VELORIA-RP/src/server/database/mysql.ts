import mysql, { Pool } from 'mysql2/promise';
import { logger } from '../core/logger';

let pool: Pool | null = null;

export async function initMySql(): Promise<Pool> {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? 'veloria',
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'veloria',
    connectionLimit: 20,
    waitForConnections: true,
    charset: 'utf8mb4'
  });

  await pool.query('SELECT 1');
  logger.info('MySQL connected');
  return pool;
}

export function db(): Pool {
  if (!pool) throw new Error('MySQL has not been initialized');
  return pool;
}
