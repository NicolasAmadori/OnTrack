import { query, param } from 'express-validator';
import { validate } from '#src/middleware/validationResult.js'

export const searchAllSolutionsValidator = [
    query('fromStationID')
        .exists().withMessage('Departure station id is required')
        .isInt({ min: 0 }).withMessage('Departure station id must be a valid number'),

    query('toStationID')
        .exists().withMessage('Arrival station id is required')
        .isInt({ min: 0 }).withMessage('Arrival station id must be a valid number'),

    query('departureDatetime')
        .exists().withMessage('Datetime is required')
        .isISO8601().withMessage('Datetime must be in ISO format'),

    query('passengersNumber')
        .exists().withMessage('Number of passengers is required')
        .isInt({ min: 1 }).withMessage('Number of passengers must be at least 1'),

    validate
];

export const getSolutionValidator = [
    param('solutionId')
        .trim()
        .notEmpty().withMessage('Solution ID is required'),

    validate
];