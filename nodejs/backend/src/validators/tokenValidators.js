import { jwtVerify } from 'jose';
import { JWT_KEY, ISSUER, AUDIENCE } from '../util/constants.js';
import User from '../models/userModel.js';

export const validTokenValidator = async (req, res, next) => {
    if (req.method === 'OPTIONS') return next(); // Verifica se il metodo è OPTIONS (preflight)

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];

        const { payload } = await jwtVerify(token, JWT_KEY, {
            issuer: ISSUER,
            audience: AUDIENCE
        });

        if (!payload?.id) {
            return res.status(400).json({
                success: false,
                errors: [{
                    field: "",
                    message: "Invalid authentication token: User ID missing"
                }]
            });
        }

        const user = await User.findById(payload.id).select('-password').lean().exec();
        if (!user) {
            return res.status(401).json({
                success: false,
                errors: [{
                    field: "Authentication Token",
                    message: "Invalid authentication token: User not existing"
                }]
            });
        }

        req.user = user;
        req.user.id = req.user._id.toString();

        next();
    } catch (err) {
        if (err.name === 'JWTClaimValidationFailed' ||
            err.name === 'JWTExpired' ||
            err.name === 'JWSSignatureVerificationFailed'
        ) {
            return res.status(401).json({
                success: false,
                errors: [{
                    field: "",
                    message: "Invalid or expired authentication token"
                }]
            });
        }

        return res.status(500).json({
            success: false,
            errors: [{
                field: "",
                message: `Error during authentication token validation: ${err.message}`
            }]
        });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({
            success: false,
            errors: [{
                field: "",
                message: 'Access forbidden: Admins only'
            }]
        });
    }
    next();
};