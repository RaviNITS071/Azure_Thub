import { Worker } from 'bullmq';
import pino from 'pino';
import { env } from '../config/env.js';

// Development: Import our Dummy Adapter
import { DummyTenderAdapter } from '../services/adapters/DummyTenderAdapter.js';
// Production: import { TenderbookAdapter } from '../services/adapters/TenderbookAdapter.js';

import SyncJob from '../models/SyncJob.js';
import Tender from '../models/Tender.js'; // Important: Import the Tender model

const logger = pino();
const connection = { host: new URL(env.REDIS_URL).hostname, port: new URL(env.REDIS_URL).port };

export const tenderSyncWorker = new Worker('TenderQueue', async (job) => {
  logger.info(`Processing Tender Sync Job: ${job.id}`);
  
  // Use development adapter
  const adapter = new DummyTenderAdapter();
  
  const syncRecord = await SyncJob.create({ sourcePortal: adapter.portalName });

  try {
    const rawTenders = await adapter.fetchList();
    let newFound = 0;

    for (const raw of rawTenders) {
      const normalized = adapter.normalize(raw);

      // Upsert Logic: Prevent duplicates by checking sourcePortal + sourceTenderId
      const result = await Tender.updateOne(
        { sourcePortal: normalized.sourcePortal, sourceTenderId: normalized.sourceTenderId },
        { $set: normalized },
        { upsert: true }
      );

      // If a new tender was inserted, increment our counter
      if (result.upsertedCount > 0) {
        newFound++;
      }
    }

    syncRecord.status = 'completed';
    syncRecord.newTendersFound = newFound;
    await syncRecord.save();
    
    logger.info(`Sync complete. Found ${newFound} new tenders.`);

  } catch (error) {
    logger.error(`Sync Job Failed: ${error.message}`);
    syncRecord.status = 'failed';
    syncRecord.errorMessage = error.message;
    await syncRecord.save();
    throw error;
  }
}, { connection });