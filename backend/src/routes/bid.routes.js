import { Router } from 'express';
import { getBids, createBid, updateBidStatus } from '../controllers/bid.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { enforceTenantScope } from '../middleware/tenantScope.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createBidSchema, updateBidSchema } from '../validators/bid.validator.js';

const router = Router();

router.use(verifyToken);
router.use(enforceTenantScope);

router.get('/', getBids);
router.post('/', validate(createBidSchema), createBid);
router.patch('/:id', validate(updateBidSchema), updateBidStatus);

export default router;