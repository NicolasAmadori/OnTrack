import { body } from 'express-validator';
import { PASSWORD_MIN_LENGTH } from '../util/constants.js';
import { validate } from './util.js'

export const authenticateValidator = [
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

export const validateTokenValidator = [
    body('authToken')
        .exists().withMessage('Authentication token required')
        .notEmpty().withMessage('Authentication token can\'t be empty')
        .isString().withMessage('Authentication token must be a string'),

    validate
];