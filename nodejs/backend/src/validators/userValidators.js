import { body } from 'express-validator';
import { PASSWORD_MIN_LENGTH } from '#src/util/constants.js';
import { validate } from '#src/middleware/validationResult.js';

export const updateUserValidator = [
    body('first_name')
        .isString().withMessage('First name must be a string')
        .trim()
        .notEmpty().withMessage('First name cannot be empty'),

    body('last_name')
        .isString().withMessage('Last name must be a string')
        .trim()
        .notEmpty().withMessage('Last name cannot be empty'),

    body('password')
        .optional()
        .isString().withMessage('Password must be a string')
        .isLength({ min: PASSWORD_MIN_LENGTH })
        .withMessage(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`),

    body('oldpassword')
        .if(body('password').exists())
        .exists().withMessage('Old password is required to set a new password')
        .isString().withMessage('Old password must be a string'),

    validate
];