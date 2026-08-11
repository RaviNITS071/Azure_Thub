import Tender from '../models/Tender.js';
import { aiQueue } from '../workers/queue.js';

export const getTenders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, state, category } = req.query;
    const query = {};
    
    if (state) query.state = state;
    if (category) query.category = category;

    const tenders = await Tender.find(query)
      .sort({ closingDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Tender.countDocuments(query);

    res.status(200).json({
      data: tenders,
      meta: { total, page: Number(page), limit: Number(limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getTenderById = async (req, res, next) => {
  try {
    const tender = await Tender.findById(req.params.id);
    if (!tender) return res.status(404).json({ error: 'Tender not found' });
    
    res.status(200).json(tender);
  } catch (error) {
    next(error);
  }
};

export const triggerAiAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const mockDocumentText = "Extracted text from the tender PDF goes here...";
    const mockDocumentHash = "abc123hash"; 

    const job = await aiQueue.add('analyze-tender', {
      tenderId: id,
      documentText: mockDocumentText,
      documentHash: mockDocumentHash
    });

    res.status(202).json({ message: 'AI Analysis queued', jobId: job.id });
  } catch (error) {
    next(error);
  }
};