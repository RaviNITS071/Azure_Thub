import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis.js';

export const apiLimiter = rateLimit({
  // Create a dedicated store instance with a unique prefix
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: 'rl-api:', 
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  // Create another dedicated store instance with a different prefix
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: 'rl-auth:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10, // Limit each IP to 10 login/register requests per hour
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});