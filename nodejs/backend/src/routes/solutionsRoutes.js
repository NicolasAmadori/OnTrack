import { Router } from 'express';
import { searchAllSolutionsValidator } from "#src/validators/solutionsValidators.js";
import { verifyToken } from "#src/middleware/authMiddleware.js";
import { get_solutions } from '../controllers/solutionsController.js';

const router = Router();

router.get('/', searchAllSolutionsValidator, verifyToken, get_solutions);

export default router;
