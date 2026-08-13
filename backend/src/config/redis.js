import Redis from 'ioredis';
import pino from 'pino';
import { env } from './env.js';

const logger = pino();

let connectionUrl = env.REDIS_URL;

// Force 'rediss://' for secure Upstash connection if not local
if (connectionUrl && !connectionUrl.includes('localhost') && !connectionUrl.includes('127.0.0.1')) {
  if (connectionUrl.startsWith('redis://')) {
    connectionUrl = connectionUrl.replace('redis://', 'rediss://');
  }
}

export const redis = new Redis(connectionUrl, {
  maxRetriesPerRequest: null, // Critical requirement for BullMQ
  tls: {
    rejectUnauthorized: false // Required for Upstash SSL
  },
  family: 4, // Forces IPv4 to prevent Render network socket drops (ECONNRESET)
  keepAlive: 30000,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => logger.info('Redis Connected Successfully'));
redis.on('error', (err) => {
  // Suppress harmless reconnect noise, log only critical errors
  if (!err.message.includes('ECONNRESET')) {
    logger.error(`Redis Error: ${err.message}`);
  }
});