import { Router } from 'express';

import {
    registerValidator
} from "#src/validators/authValidators.js";

import {
    create_user
} from '#src/controllers/usersController.js';

const router = Router();

router.post("/", registerValidator, create_user);

export default router;