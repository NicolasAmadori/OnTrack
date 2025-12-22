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
            return res.status(401).json({
                success: false,
                errors: [{
                    field: "",
                    message: "Invalid credentials"
                }]
            });
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
            success: true,
            token: jwt_signed_token,
            id: userWithoutPassword._id.toString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errors: [{
                field: "",
                message: `Error during authentication: ${error.message}`
            }]
        });
    }
}

export const validateToken = async function(req, res) {
    //Endpoint protected by authentication middleware
    return res.status(200).json({
        success: true
    });
};