import mongoose from 'mongoose';

const tenderRequirementSchema = new mongoose.Schema({
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true, index: true },
  type: { type: String, required: true }, // e.g., 'Turnover', 'Experience', 'Eligibility'
  description: { type: String, required: true },
  minValue: { type: Number }
}, { timestamps: true });

export default mongoose.model('TenderRequirement', tenderRequirementSchema);