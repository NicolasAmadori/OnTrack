import { requireAdminOrReservationOwner, requireAdminOrSelf, verifyToken } from "#src/middleware/authMiddleware.js";
import { authHeaderValidator } from "#src/validators/commonValidator.js";
import { Router } from "express";
import { get_user_reservations, get_active_reservations_nodes, delete_reservation, create_reservation } from "#src/controllers/reservationsController.js";

const router = Router();

router.post('/:userId', authHeaderValidator, verifyToken, requireAdminOrSelf, create_reservation);
router.get('/:userId', authHeaderValidator, verifyToken, requireAdminOrSelf, get_user_reservations);
router.get('/active/:userId', authHeaderValidator, verifyToken, requireAdminOrSelf, get_active_reservations_nodes);
router.delete('/:reservationId', authHeaderValidator, verifyToken, requireAdminOrReservationOwner, delete_reservation);

export default router;