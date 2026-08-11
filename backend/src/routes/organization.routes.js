import { Router } from 'express';
import { getOrganizationProfile, updateOrganizationProfile } from '../controllers/organization.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { enforceTenantScope } from '../middleware/tenantScope.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = Router();

// Apply auth and tenant isolation to all routes here
router.use(verifyToken);
router.use(enforceTenantScope);

router.get('/profile', getOrganizationProfile);

// Only allow owners or admins to modify company details
router.put('/profile', requireRole(['owner', 'admin']), updateOrganizationProfile);

export default router;