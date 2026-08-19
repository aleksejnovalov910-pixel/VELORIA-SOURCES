import Redis from 'ioredis';
import { logger } from '../core/logger';

let redis: Redis | null = null;

export async function initRedis(): Promise<Redis> {
  if (redis) return redis;

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
    logger.error('Redis connection failed. Check REDIS_HOST/REDIS_PORT/REDIS_PASSWORD.', error);
    throw error;
  }
}

export function cache(): Redis {
  if (!redis) throw new Error('Redis has not been initialized');
  return redis;
}
