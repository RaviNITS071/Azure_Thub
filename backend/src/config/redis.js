import Redis from 'ioredis';
import pino from 'pino';
import { env } from './env.js';

const logger = pino();

// Use explicit object configuration to prevent Upstash TLS handshake drops on Render
export const redis = new Redis({
  host: 'humble-werewolf-181905.upstash.io', // Your Upstash Endpoint
  port: 6379,
  password: 'gQAAAAAAAsaRAAIgcDFlYTMwODZkYzFlMGU0ZWZlYmE0MmExZGMxNGZlN2FhMg', // Replace with your actual token string
  tls: {
    rejectUnauthorized: false
  },
  family: 4, // Force IPv4 to prevent Render socket resets
  keepAlive: 30000,
  maxRetriesPerRequest: null, // Critical requirement for BullMQ
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('connect', () => logger.info('Redis Connected Successfully'));
redis.on('error', (err) => {
  if (!err.message.includes('ECONNRESET')) {
    logger.error(`Redis Error: ${err.message}`);
  }
});