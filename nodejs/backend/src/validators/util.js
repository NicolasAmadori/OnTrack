import { validationResult } from 'express-validator';

//Middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors.map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};