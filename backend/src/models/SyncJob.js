import mongoose from 'mongoose';

const syncJobSchema = new mongoose.Schema({
  sourcePortal: { type: String, required: true, index: true },
  status: { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
  itemsProcessed: { type: Number, default: 0 },
  newTendersFound: { type: Number, default: 0 },
  errorMessage: { type: String }
}, { timestamps: true });

export default mongoose.model('SyncJob', syncJobSchema);