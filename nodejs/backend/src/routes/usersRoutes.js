import { Router } from 'express';

import {
    registerValidator
} from "#src/validators/authValidators.js";

import {
    create_user,
    update_user,
    delete_user,
    get_user,
    get_all_users
} from '#src/controllers/usersController.js';
import { authHeaderValidator } from '#src/validators/commonValidator.js';
import { updateUserValidator } from '#src/validators/userValidators.js';
import { requireAdmin, requireAdminOrSelf, verifyToken } from '#src/middleware/authMiddleware.js';

const router = Router();

router.get("/", authHeaderValidator, verifyToken, requireAdmin, get_all_users);
router.get("/:userId", authHeaderValidator, verifyToken, requireAdminOrSelf, get_user);

router.post("/", registerValidator, create_user);

router.patch("/:userId", authHeaderValidator, updateUserValidator, verifyToken, requireAdminOrSelf, update_user);

router.delete("/:userId", authHeaderValidator, verifyToken, requireAdminOrSelf, delete_user);

export default router;