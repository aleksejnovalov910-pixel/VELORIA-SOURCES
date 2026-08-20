import Redis from 'ioredis';
import { logger } from '../core/logger';

let redis: any = null;
let redisDisabled = false;

function envFlag(name: string, fallback = false): boolean {
  const raw = String(process.env[name] ?? '').trim().toLowerCase();
  if (!raw) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(raw);
}

export function isRedisEnabled(): boolean {
  return envFlag('REDIS_ENABLED', false);
}

export async function initRedis(): Promise<any | null> {
  if (redis) return redis;
  if (redisDisabled || !isRedisEnabled()) {
    redisDisabled = true;
    logger.info('Redis disabled; VELORIA will run in MySQL-only mode');
    return null;
  }

  const client = new Redis({
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    connectTimeout: 5000,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null
  });

  try {
    await client.connect();
    await client.ping();
    redis = client;
    logger.info('Redis connected');
    return client;
  } catch (error) {
    client.disconnect();
    if (envFlag('REDIS_REQUIRED', false)) {
      logger.error('Redis connection failed and REDIS_REQUIRED=true', error);
      throw error;
    }
    redisDisabled = true;
    logger.warn('Redis unavailable; continuing in MySQL-only mode');
    return null;
  }
}

export function cache(): any | null {
  return redis;
}
