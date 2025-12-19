import { Router } from 'express';

import {
    create_user,
    test
} from '../controllers/usersController.js';

const router = Router();

router.post("/", create_user);
router.get("/", test);

export default router;