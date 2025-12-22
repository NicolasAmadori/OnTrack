import { body, header } from 'express-validator';
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

export const authHeaderValidator = [
    header('authorization')
        .exists().withMessage('Authorization header is required')
        .isString().withMessage('Authentication header must be a string')
        .custom((value) => value.startsWith('Bearer '))
        .withMessage('Token must be Bearer type'),
    
    validate
];