import { Router } from 'express';
import { getSolutionValidator, searchAllSolutionsValidator} from "#src/validators/solutionsValidators.js";
import { verifyToken } from "#src/middleware/authMiddleware.js";
import { get_solution, get_solution_occupied_seats, get_solutions } from '../controllers/solutionsController.js';
import { authHeaderValidator } from "#src/validators/commonValidator.js";

const router = Router();

router.get('/', searchAllSolutionsValidator, verifyToken, get_solutions);
router.get('/:solutionId', getSolutionValidator, verifyToken, get_solution);
router.get('/:solutionId/occupiedSeats', authHeaderValidator, getSolutionValidator, verifyToken, get_solution_occupied_seats);

export default router;
