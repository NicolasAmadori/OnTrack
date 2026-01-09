import { requireAdminOrSelf, verifyToken } from "#src/middleware/authMiddleware.js";
import { authHeaderValidator } from "#src/validators/commonValidator.js";
import { Router } from "express";
import { get_user_reservations } from "#src/controllers/reservationsController.js";

const router = Router();

router.get('/:userId', authHeaderValidator, verifyToken, requireAdminOrSelf, get_user_reservations);

export default router;