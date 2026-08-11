import { Router } from 'express';
import { getPresignedUrl, confirmDocumentUpload } from '../controllers/document.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { enforceTenantScope } from '../middleware/tenantScope.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { presignSchema, confirmDocumentSchema } from '../validators/document.validator.js';

const router = Router();

router.use(verifyToken);
router.use(enforceTenantScope);

router.post('/presign', validate(presignSchema), getPresignedUrl);
router.post('/confirm', validate(confirmDocumentSchema), confirmDocumentUpload);

export default router;