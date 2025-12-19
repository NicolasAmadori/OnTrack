import { Router } from 'express';

import {
    authenticateValidator,
    validateTokenValidator
} from "../validators/authValidators.js";

import {
    authenticate,
    validateToken
} from '../controllers/authController.js';

const router = Router();

router.post('/', authenticateValidator, authenticate);
router.post('/validate', validateTokenValidator, validateToken);

export default router;