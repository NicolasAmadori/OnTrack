import { Router } from 'express';
import { getSolutionValidator, searchAllSolutionsValidator} from "#src/validators/solutionsValidators.js";
import { verifyToken } from "#src/middleware/authMiddleware.js";
import { get_solution, get_solution_occupied_seats, get_solutions } from '../controllers/solutionsController.js';
import { authHeaderValidator } from "#src/validators/commonValidator.js";
import { createOrRenewLock, deleteLock, getSelectedSeats } from "#src/controllers/redisController.js";
import { createLockValidator, deleteLockValidator } from "#src/validators/reservationValidators.js";

const router = Router();

router.get('/', searchAllSolutionsValidator, verifyToken, get_solutions);
router.get('/:solutionId', getSolutionValidator, verifyToken, get_solution);
router.get('/:solutionId/occupiedSeats', authHeaderValidator, getSolutionValidator, verifyToken, get_solution_occupied_seats);

router.get('/:solutionId/selectedSeats', authHeaderValidator, getSolutionValidator, verifyToken, getSelectedSeats);
router.post('/:solutionId/select', authHeaderValidator, getSolutionValidator, createLockValidator, verifyToken, createOrRenewLock);
router.delete('/:solutionId/unselect/:trainId/:seat', authHeaderValidator, deleteLockValidator, verifyToken, deleteLock);

export default router;
