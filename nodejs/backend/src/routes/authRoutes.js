import { Router } from 'express';

import {
    authenticate,
} from '../controllers/authController.js';

const router = Router();

router.post('/', authenticate);

export default router;