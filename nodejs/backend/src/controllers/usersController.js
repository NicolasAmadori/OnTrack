import User from '../models/userModel.js';
import { hash } from '@node-rs/argon2';

export const create_user = async function(req, res) {
    try {
        const user = req.body;

        user.password = await hash(user.password);

        const isEmailAlreadyPresent = await User.findOne({ email: req.body.email }).exec();

        if (isEmailAlreadyPresent) {
            return res.status(409).json({
                success: false,
                errors: [{
                    field: "",
                    message: "Email already exists in the database"
                }]
            });
        }

        const createdUser = await User.create(user);
        const userWithoutPassword = createdUser.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            errors: [{
                field: "",
                message: error.message
            }]
        });
    }
}