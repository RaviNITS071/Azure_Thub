import 'dotenv/config';
import { connectDB } from '../config/db.js';
import pino from 'pino';
import { tenderSyncWorker } from './tenderSync.worker.js';
import { aiSummaryWorker } from './aiSummary.worker.js';
// Import other workers here

const logger = pino();

const startWorkers = async () => {
  try {
    await connectDB();
    logger.info('Background Workers initialized and waiting for jobs...');
    
    // Attach error listeners
    tenderSyncWorker.on('failed', (job, err) => logger.error(`TenderSync Job ${job.id} failed: ${err.message}`));
    aiSummaryWorker.on('failed', (job, err) => logger.error(`AISummary Job ${job.id} failed: ${err.message}`));

  } catch (error) {
    logger.error(`Worker startup failed: ${error.message}`);
    process.exit(1);
  }
};

startWorkers();