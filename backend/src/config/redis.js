import Redis from 'ioredis';
import pino from 'pino';
import { env } from './env.js';

const logger = pino();

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Critical requirement for BullMQ
  tls: {
    rejectUnauthorized: false // Required for secure Upstash cloud connections
  },
  keepAlive: 30000, // Sends periodic packets to prevent Render from dropping the TCP connection
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => logger.info('Redis Connected Successfully'));
redis.on('error', (err) => logger.error(`Redis Error: ${err.message}`));