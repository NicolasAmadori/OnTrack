import { Router } from 'express';

import {
    authenticateValidator,
    authHeaderValidator
} from "../validators/authValidators.js";

import {
    validTokenValidator
} from "../validators/tokenValidators.js";

import {
    authenticate,
    validateToken
} from '../controllers/authController.js';

const router = Router();

router.post('/', authenticateValidator, authenticate);
router.post('/validate', authHeaderValidator, validTokenValidator, validateToken);

export default router;