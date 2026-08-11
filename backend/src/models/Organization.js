import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gstin: { type: String, trim: true },
  website: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Organization', organizationSchema);