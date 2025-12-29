import { Router } from 'express';

import {
    registerValidator
} from "#src/validators/authValidators.js";

import {
    create_user,
    update_user,
    get_user
} from '#src/controllers/usersController.js';
import { authHeaderValidator } from '#src/validators/commonValidator.js';
import { updateUserValidator } from '#src/validators/userValidators.js';
import { requireAdminOrSelf, verifyToken } from '#src/middleware/authMiddleware.js';

const router = Router();

router.post("/", registerValidator, create_user);
router.patch("/:userId", authHeaderValidator, updateUserValidator, verifyToken, requireAdminOrSelf, update_user);
router.get("/:userId", authHeaderValidator, verifyToken, requireAdminOrSelf, get_user);

export default router;