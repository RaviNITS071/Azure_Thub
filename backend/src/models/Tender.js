import mongoose from 'mongoose';

const tenderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  sourcePortal: { type: String, required: true },
  sourceTenderId: { type: String, required: true },
  state: { type: String, index: true },
  district: { type: String, index: true },
  category: { type: String, index: true },
  closingDate: { type: Date, required: true, index: true },
  publishedDate: { type: Date },
  estimatedValue: { type: Number }
}, { timestamps: true });

// Required compound indexes for deduplication and matching/filtering
tenderSchema.index({ sourcePortal: 1, sourceTenderId: 1 }, { unique: true });
tenderSchema.index({ state: 1, district: 1, closingDate: 1 });
tenderSchema.index({ category: 1, closingDate: 1 });

export default mongoose.model('Tender', tenderSchema);