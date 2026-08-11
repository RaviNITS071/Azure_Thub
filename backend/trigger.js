import 'dotenv/config';
import { Queue } from 'bullmq';

// Connect to the Redis queue
const tenderQueue = new Queue('TenderQueue', { 
  connection: { 
    host: '127.0.0.1', 
    port: 6379 
  } 
});

async function triggerSync() {
  console.log('Adding sync job to queue...');
  await tenderQueue.add('sync-dummy-tenders', {});
  console.log('Job added! Check your worker terminal.');
  process.exit(0);
}

triggerSync();