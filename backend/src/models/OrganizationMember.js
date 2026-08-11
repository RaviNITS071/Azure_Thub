import mongoose from 'mongoose';

const organizationMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' }
}, { timestamps: true });

// Prevent a user from having multiple roles in the same organization
organizationMemberSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

export default mongoose.model('OrganizationMember', organizationMemberSchema);