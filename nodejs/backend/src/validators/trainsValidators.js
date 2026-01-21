import { body } from 'express-validator';
import { validate } from '#src/middleware/validationResult.js';

export const updateTrainValidator = [
    body('delay')
        .optional()
        .isInt({ min: 0 }).withMessage('Delay must be a non-negative integer'),

    body('cancelled')
        .optional()
        .isBoolean().withMessage('Cancelled must be a boolean value'),

    body('bathrooms')
        .optional()
        .isArray().withMessage('Bathrooms must be an array'),
    body('bathrooms.*.isOccupied')
        .if(body('bathrooms').exists())
        .isBoolean().withMessage('isOccupied must be a boolean value'),
    body('bathrooms.*.queue')
        .if(body('bathrooms').exists())
        .isArray().withMessage('Queue must be an array of strings'),

    validate
];