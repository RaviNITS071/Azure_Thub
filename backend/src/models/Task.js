import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', index: true, required: true },
  bidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid' },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  dueDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);