import { Worker } from 'bullmq';
import pino from 'pino';
import { env } from '../config/env.js';
import { JKTenderAdapter } from '../services/adapters/JKTenderAdapter.js';
import SyncJob from '../models/SyncJob.js';
import Tender from '../models/Tender.js';

const logger = pino();
const connection = { host: new URL(env.REDIS_URL).hostname, port: new URL(env.REDIS_URL).port };

export const tenderSyncWorker = new Worker('TenderQueue', async (job) => {
  logger.info(`Processing Tender Sync Job: ${job.id}`);
  
  const adapter = new JKTenderAdapter();
  const syncRecord = await SyncJob.create({ sourcePortal: adapter.portalName });
  let newFound = 0;

  // --- CALLBACK TO SAVE DATA PAGE-BY-PAGE ---
  const savePageToDb = async (pageData) => {
    logger.info(`[Worker] Saving ${pageData.length} tenders from current page to DB...`);
    
    for (const raw of pageData) {
      const normalized = adapter.normalize(raw);

      // Upsert logic with error handling for duplicates
      const result = await Tender.updateOne(
        { sourcePortal: normalized.sourcePortal, sourceTenderId: normalized.sourceTenderId },
        { $set: normalized },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        newFound++;
      }
    }
  };

  try {
    // Run the scraper passing the callback
    // Mode is set to 'FULL' as per your requirement to fetch all 797 pages
    await adapter.fetchList(1, { syncMode: 'FULL' }, savePageToDb);

    syncRecord.status = 'completed';
    syncRecord.newTendersFound = newFound;
    await syncRecord.save();
    
    logger.info(`Sync complete. Total new tenders added: ${newFound}`);

  } catch (error) {
    logger.error(`Sync Job Failed: ${error.message}`);
    syncRecord.status = 'failed';
    syncRecord.errorMessage = error.message;
    await syncRecord.save();
    throw error;
  }
}, { connection });