import { header } from 'express-validator';
import { validate } from '#src/middleware/validationResult.js'

export const authHeaderValidator = [
    header('authorization')
        .exists().withMessage('Authorization header is required')
        .isString().withMessage('Authentication header must be a string')
        .custom((value) => value.startsWith('Bearer '))
        .withMessage('Token must be Bearer type'),

    validate
];