import User from '../models/userModel.js';
import { hash } from '@node-rs/argon2';

import { PASSWORD_MIN_LENGTH } from "../util/constants.js";

export const create_user = async function(req, res) {
    try {
        const user = req.body;
        if (user.password.length < PASSWORD_MIN_LENGTH) {
            return res.status(400).json({ message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` });
        }
        user.is_admin = false;
        user.password = await hash(user.password);


        const isEmailAlreadyPresent = await User.findOne({ email: req.body.email }).exec();

        if (isEmailAlreadyPresent) {
            return res.status(409).json({ message: "Email already exists in the database" });
        }

        const createdUser = await User.create(user);
        const userWithoutPassword = createdUser.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const test = async function(req, res) {
    return res.status(201).json({"status": "ok"});
}