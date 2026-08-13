import Tender from '../models/Tender.js';
import { aiQueue } from '../workers/queue.js';

/**
 * Fetch a paginated list of tenders from the database.
 * Supports optional query parameters for filtering by state and category.
 * 
 * @route GET /api/tenders
 * @param {Object} req.query - URL query parameters (page, limit, state, category)
 */
export const getTenders = async (req, res, next) => {
  try {
    // Extract pagination and filter parameters with default fallback values
    const { page = 1, limit = 20, state, category } = req.query;
    const query = {};
    
    // Apply filters dynamically if they exist in the request
    if (state) query.state = state;
    if (category) query.category = category;

    // Fetch matching documents, sort by deadline, and apply pagination
    const tenders = await Tender.find(query)
      .sort({ closingDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Get the total count of documents matching the query for frontend pagination logic
    const total = await Tender.countDocuments(query);

    // Send the data payload along with metadata
    res.status(200).json({
      data: tenders,
      meta: { total, page: Number(page), limit: Number(limit) }
    });
  } catch (error) {
    // Pass any errors to the global error handling middleware
    next(error);
  }
};

/**
 * Fetch a single tender document by its unique database ID.
 * 
 * @route GET /api/tenders/:id
 * @param {string} req.params.id - The MongoDB ObjectId of the tender
 */
export const getTenderById = async (req, res, next) => {
  try {
    const tender = await Tender.findById(req.params.id);
    
    // Handle the case where the ID is valid but the document does not exist
    if (!tender) return res.status(404).json({ error: 'Tender not found' });
    
    res.status(200).json(tender);
  } catch (error) {
    next(error);
  }
};

/**
 * Dispatch an asynchronous background job to analyze a tender document using AI.
 * Pushes the task into a message queue (e.g., BullMQ/Redis) for decoupled processing.
 * 
 * @route POST /api/tenders/:id/analyze
 * @param {string} req.params.id - The ID of the tender being analyzed
 */
export const triggerAiAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // TODO: In production, these variables should be dynamically extracted from the actual file or database
    const mockDocumentText = "Extracted text from the tender PDF goes here...";
    const mockDocumentHash = "abc123hash"; 

    // Add the analysis task to the worker queue
    const job = await aiQueue.add('analyze-tender', {
      tenderId: id,
      documentText: mockDocumentText,
      documentHash: mockDocumentHash
    });

    // Return a 202 Accepted status indicating the job has been queued successfully
    res.status(202).json({ message: 'AI Analysis queued', jobId: job.id });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate and fetch real-time aggregated statistics for the platform dashboard.
 * Utilizes MongoDB aggregation pipelines for optimal performance.
 * 
 * @route GET /api/tenders/stats
 */
export const getTenderStats = async (req, res, next) => {
  try {
    // 1. Get the total count of all tenders currently in the database
    const activeTendersCount = await Tender.countDocuments();

    // 2. Extract unique issuing authorities to calculate the total number of organizations
    const authorities = await Tender.distinct('authority');
    const authoritiesCount = authorities.length;

    // 3. Calculate the sum of all tender values using the Aggregation Pipeline
    // NOTE: Ensure the field name "$value" matches the numeric field in your Tender schema
    const valueAggregation = await Tender.aggregate([
      { $group: { _id: null, totalValue: { $sum: "$value" } } } 
    ]);
    const totalValue = valueAggregation.length > 0 ? valueAggregation[0].totalValue : 0;

    // Send the computed metrics to the frontend
    res.status(200).json({
      activeTendersCount,
      authoritiesCount,
      totalValue
    });
  } catch (error) {
    console.error("Error calculating tender stats:", error);
    next(error);
  }
};