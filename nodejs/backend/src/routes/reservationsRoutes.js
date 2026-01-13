import { requireAdminOrReservationOwner, requireAdminOrSelf, verifyToken } from "#src/middleware/authMiddleware.js";
import { authHeaderValidator } from "#src/validators/commonValidator.js";
import { Router } from "express";
import { get_user_reservations, delete_reservation } from "#src/controllers/reservationsController.js";

const router = Router();

router.get('/:userId', authHeaderValidator, verifyToken, requireAdminOrSelf, get_user_reservations);
router.delete('/:reservationId', authHeaderValidator, verifyToken, requireAdminOrReservationOwner, delete_reservation);

export default router;