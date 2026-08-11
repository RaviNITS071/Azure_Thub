# backend/src/workers — BullMQ job processors

TODO
- [ ] queue.js — BullMQ Queue + QueueEvents setup, one queue per job type or one shared queue with a
      `type` field — pick one convention and stay consistent
- [ ] tenderSync.worker.js — cron-triggered (or repeatable BullMQ job), runs the adapter, dedups, writes
      tenders/tenderUpdates/corrigenda, logs to syncJobs
- [ ] documentDownload.worker.js — pulls new tender documents down and stores them
- [ ] aiSummary.worker.js — pulls PDF from storage, extracts text, calls ai.service, saves aiAnalyses
- [ ] notification.worker.js — fans out notification jobs triggered by tender updates
- [ ] index.js / run.js — entry point that starts all worker processors; this is what `npm run worker` runs
      as a second PM2 process, separate from the API process
