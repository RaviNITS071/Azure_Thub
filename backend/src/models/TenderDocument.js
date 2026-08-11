import mongoose from 'mongoose';

const tenderDocumentSchema = new mongoose.Schema({
  tenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true, index: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  fileType: { type: String },
  fileHash: { type: String }, 
  
  // RAG / Vector DB Future-Proofing
  documentId: { type: String },
  page: { type: Number },
  section: { type: String },
  chunk: { type: Number },
  sourceText: { type: String }
}, { timestamps: true });

export default mongoose.model('TenderDocument', tenderDocumentSchema);