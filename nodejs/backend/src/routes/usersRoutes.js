import { Router } from 'express';

import {
    createUserValidator
} from "../validators/userValidators.js";

import {
    create_user
} from '../controllers/usersController.js';

const router = Router();

router.post("/", createUserValidator, create_user);

export default router;