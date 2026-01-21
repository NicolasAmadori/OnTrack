import { requireAdmin, verifyToken } from '#src/middleware/authMiddleware.js';
import { authHeaderValidator } from '#src/validators/commonValidator.js';
import { updateTrainValidator } from '#src/validators/trainsValidators.js';
import { Router } from 'express';

import { get_trains, get_train, cancel_restore_train, update_train, toggle_user_to_bathroom_queue } from '#src/controllers/trainsController.js';

const router = Router();

router.get('/', authHeaderValidator, verifyToken, requireAdmin, get_trains);
router.get('/:trainCode', get_train);
router.delete('/:trainId', authHeaderValidator, verifyToken, requireAdmin, cancel_restore_train);
router.patch('/:trainId', authHeaderValidator, updateTrainValidator, verifyToken, requireAdmin, update_train);
router.patch('/:trainId/bathroom/:bathroomIndex/queue/:userId', authHeaderValidator, verifyToken, toggle_user_to_bathroom_queue);

export default router;
