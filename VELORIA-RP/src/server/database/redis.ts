import Redis from 'ioredis';
import { logger } from '../core/logger';

let redis: Redis | null = null;

export async function initRedis(): Promise<Redis> {
  if (redis) return redis;

  redis = new Redis({
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true
  });

  await redis.connect();
  await redis.ping();
  logger.info('Redis connected');
  return redis;
}

export function cache(): Redis {
  if (!redis) throw new Error('Redis has not been initialized');
  return redis;
}
