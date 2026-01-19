import { body } from 'express-validator';
import { validate } from '#src/middleware/validationResult.js';

export const createLockValidator = [
    body('nodeId')
        .isString().withMessage('nodeId must be a string')
        .trim()
        .notEmpty().withMessage('Node ID cannot be empty'),

    body('seat')
        .isString().withMessage('seat must be a string')
        .trim()
        .notEmpty().withMessage('Seat cannot be empty'),

    validate
];

export const deleteLockValidator = [
    param('solutionId')
        .isString().withMessage('solutionId must be a string')
        .trim()
        .notEmpty().withMessage('Solution ID is required'),

    param('nodeId')
        .isString().withMessage('nodeId must be a string')
        .trim()
        .notEmpty().withMessage('Node ID is required'),

    param('seat')
        .isString().withMessage('seat must be a string')
        .trim()
        .notEmpty().withMessage('Seat is required'),

    validate
];