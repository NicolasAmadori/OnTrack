import { query } from 'express-validator';
import { validate } from '#src/middleware/validationResult.js';

export const getAllStationsValidator = [
    query('station_name')
        .optional()
        .isString()
        .withMessage('station_name must be a string')
        .trim(),

    validate
];