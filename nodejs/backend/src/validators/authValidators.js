import { body, checkExact } from 'express-validator';

import { PASSWORD_MIN_LENGTH } from '#src/util/constants.js';
import { validate } from '#src/middleware/validationResult.js'

export const loginValidator = [
    body('email')
        .exists().withMessage('Email required')
        .isEmail().withMessage('Insert a valid email address')
        .normalizeEmail(),

    body('password')
        .exists().withMessage('Password required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: PASSWORD_MIN_LENGTH })
        .withMessage(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`),

    validate
];

export const registerValidator = [
    body('email')
        .exists().withMessage('Email required')
        .isEmail().withMessage('Insert a valid email address')
        .normalizeEmail(),

    body('password')
        .exists().withMessage('Password required')
        .isString().withMessage('Password must be a string')
        .isLength({ min: PASSWORD_MIN_LENGTH })
        .withMessage(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`),

    body('first_name')
        .exists().withMessage('First name required')
        .isString().withMessage('First name must be a string')
        .trim()
        .notEmpty().withMessage('First name cannot be empty'),

    body('last_name')
        .exists().withMessage('Last name required')
        .isString().withMessage('Last name must be a string')
        .trim()
        .notEmpty().withMessage('Last name cannot be empty'),

    checkExact([], { message: 'Unknown fields are not allowed' }),

    validate
];