import User from '../models/userModel.js';

import { verify } from '@node-rs/argon2';
import { SignJWT, jwtVerify } from 'jose';
import { TOKEN_EXPIRY, JWT_KEY, ISSUER, AUDIENCE } from '../util/constants.js';

export const authenticate = async function(req, res) {
    try {
        const { email, password } = req.body;

        const token = {};
        const user = await User.findOne({ email: email }).exec();

        if (!user || !await verify(user.password, password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        token.id = userWithoutPassword._id.toString();

        const jwt_signed_token = await new SignJWT(token) //Token encoding
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer(ISSUER)
            .setAudience(AUDIENCE)
            .setExpirationTime(TOKEN_EXPIRY)
            .sign(JWT_KEY);
        return res.status(200).json({
            "token": jwt_signed_token,
            "id": userWithoutPassword._id.toString()
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error during authentication: ' + error.message });
    }
}

export const validateToken = async function(req, res) {
    try {
        const { authToken } = req.body;

        const { payload } = await jwtVerify(authToken, JWT_KEY, {
            issuer: ISSUER,
            audience: AUDIENCE
        });

        if (!payload?.id) {
            return res.status(400).json({ message: 'Invalid authentication token: User ID missing' });
        }

        const userExists = await User.exists({ _id: payload.id });
        if (!userExists) {
            return res.status(401).json({ message: 'Invalid authentication token: User not existing' });
        }

        return res.status(200).json({ message: "Token is valid" });
    } catch (error) {
        if (error.name === 'JWTClaimValidationFailed' ||
            error.name === 'JWTExpired' ||
            error.name === 'JWSSignatureVerificationFailed'
        ) {
            return res.status(401).json({ message: 'Invalid or expired authentication token' });
        }

        return res.status(500).json({ message: 'Error during authentication token validation: ' + error.message });
    }
};