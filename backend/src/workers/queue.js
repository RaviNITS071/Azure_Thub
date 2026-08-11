import { Queue } from 'bullmq';
import { env } from '../config/env.js';

const connection = {
  host: new URL(env.REDIS_URL).hostname,
  port: new URL(env.REDIS_URL).port || 6379,
  password: new URL(env.REDIS_URL).password || undefined,
};

export const tenderQueue = new Queue('TenderQueue', { connection });
export const aiQueue = new Queue('AIQueue', { connection });
export const documentQueue = new Queue('DocumentQueue', { connection });
export const notificationQueue = new Queue('NotificationQueue', { connection });