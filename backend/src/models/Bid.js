import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', index: true, required: true },
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  status: { type: String, enum: ['draft', 'review', 'submitted', 'won', 'lost'], default: 'draft' },
  submissionDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Bid', bidSchema);