import { Router } from 'express';

import {
    loginValidator
} from "#src/validators/authValidators.js";

import {
    authHeaderValidator
} from "#src/validators/commonValidator.js";

import {
    verifyToken
} from "#src/middleware/authMiddleware.js";

import {
    authenticate,
    validateToken
} from '../controllers/authController.js';

const router = Router();

router.post('/', loginValidator, authenticate);
router.post('/validate', authHeaderValidator, verifyToken, validateToken);

export default router;