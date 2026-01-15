import { Router } from 'express';
import { getSolutionValidator, searchAllSolutionsValidator} from "#src/validators/solutionsValidators.js";
import { verifyToken } from "#src/middleware/authMiddleware.js";
import { get_solution, get_solutions} from '../controllers/solutionsController.js';

const router = Router();

router.get('/', searchAllSolutionsValidator, verifyToken, get_solutions);
router.get('/:solutionId', getSolutionValidator, verifyToken, get_solution);

export default router;
