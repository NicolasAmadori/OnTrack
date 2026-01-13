import { jwtVerify } from 'jose';
import { JWT_KEY, ISSUER, AUDIENCE } from '#src/util/constants.js';
import User from '#src/models/userModel.js';

export const verifyToken = async (req, res, next) => {
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
                    message: "Invalid authentication token: User ID missing"
                }]
            });
        }

        const user = await User.findById(payload.id).select('-password').lean().exec();
        if (!user) {
            return res.status(401).json({
                success: false,
                errors: [{
                    message: "Authentication Token: Invalid authentication token: User not existing"
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
                    message: "Invalid or expired authentication token"
                }]
            });
        }

        return res.status(500).json({
            success: false,
            errors: [{
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
                message: 'Access forbidden: Admins only'
            }]
        });
    }
    next();
};

export const requireAdminOrSelf = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();
    
    const userIdFromToken = req.user.id;
    const userIdToAccess = req.params.userId;

    const isAdmin = req.user.is_admin === true;
    const isSameUser = userIdFromToken === userIdToAccess;

    if (!isAdmin && !isSameUser) {
        return res.status(403).json({ success:false, errors: [{
            message: 'Access forbidden: You can not access this user'
        }] });
    }

    next();
};

export const requireAdminOrReservationOwner = async (req, res, next) => {
  try {
    const userIdFromToken = req.user.id;
    const reservationId = req.params.reservationId;

    const user = await User.findById(userIdFromToken).exec();

    const isAdmin = req.user.is_admin === true;
    const hasReservation = user.reservations.some(reservation => reservation.toString() === reservationId);

    if (!isAdmin && !hasReservation) {
      return res.status(403).json({ message: 'Access forbidden: You can not access this reservation' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Error during authorization: ' + err.message });
  }
};