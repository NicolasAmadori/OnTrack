import { body, param } from 'express-validator';
import { validate } from '#src/middleware/validationResult.js';

export const createOrRenewLockValidator = [
    body('bookingGroups')
        .isArray()
        .withMessage('Seats must be an array of booking groups'),

    body('bookingGroups.*.trainCode')
        .isString().notEmpty()
        .withMessage('Train code is required and must be a string'),

    body('bookingGroups.*.departureTime')
        .isString().notEmpty()
        .withMessage('Departure time is required'),

    body('bookingGroups.*.arrivalTime')
        .isString().notEmpty()
        .withMessage('Arrival time is required'),

    body('bookingGroups.*.seats')
        .isArray()
        .withMessage('Each group must contain a list of seats'),

    body('bookingGroups.*.seats.*')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Seat ID must be a valid string'),

    validate
];