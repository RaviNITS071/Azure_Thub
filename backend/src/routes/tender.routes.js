import { Router } from 'express';
import { getTenders, getTenderById, triggerAiAnalysis } from '../controllers/tender.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getTenders);
router.get('/:id', getTenderById);
router.post('/:id/analyze', verifyToken, triggerAiAnalysis);

export default router;