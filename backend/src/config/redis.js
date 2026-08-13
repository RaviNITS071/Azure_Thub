import Redis from 'ioredis';
import pino from 'pino';
import { env } from './env.js';

const logger = pino();

// Automatically force 'rediss://' for secure cloud redis (like Upstash) if not running locally
let connectionUrl = env.REDIS_URL;
if (connectionUrl && !connectionUrl.includes('localhost') && !connectionUrl.includes('127.0.0.1')) {
  if (connectionUrl.startsWith('redis://')) {
    connectionUrl = connectionUrl.replace('redis://', 'rediss://');
  }
}

export const redis = new Redis(connectionUrl, {
  maxRetriesPerRequest: null, // Critical for BullMQ
  tls: {
    rejectUnauthorized: false // Required for Upstash SSL verification
  },
  keepAlive: 30000, // Keeps TCP socket active to prevent Render drops
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => logger.info('Redis Connected Successfully'));
redis.on('error', (err) => logger.error(`Redis Error: ${err.message}`));