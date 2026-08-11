import Redis from 'ioredis';
import pino from 'pino';
import { env } from './env.js';

const logger = pino();

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Critical requirement for BullMQ
});

redis.on('connect', () => logger.info('Redis Connected Successfully'));
redis.on('error', (err) => logger.error(`Redis Error: ${err.message}`));