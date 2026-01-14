import { requireAdmin, verifyToken } from '#src/middleware/authMiddleware.js';
import { authHeaderValidator } from '#src/validators/commonValidator.js';
import { Router } from 'express';

import { get_trains, cancel_restore_train } from '#src/controllers/trainsController.js';

const router = Router();

router.get('/', authHeaderValidator, verifyToken, requireAdmin, get_trains);
router.delete('/:trainId', authHeaderValidator, verifyToken, requireAdmin, cancel_restore_train);

export default router;
