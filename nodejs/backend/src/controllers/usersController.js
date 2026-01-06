import User from '#src/models/userModel.js';
import { hash, verify } from '@node-rs/argon2';

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

export const update_user = async function(req, res) {
    try {
        const id = req.params.userId;
        const user = req.body;
        const updatedUser = {};

        updatedUser.first_name = user.first_name;
        updatedUser.last_name = user.last_name;
        if (user.oldpassword && user.password) {
            const oldPasswordHash = (await User.findById(id).select('password').exec()).toObject().password;
            if (!await verify(oldPasswordHash, user.oldpassword)) {
                return res.status(401).json({ success: false, errors: [{
                field: "",
                message: "Old password is incorrect"
            }] });
            }
            updatedUser.password = await hash(user.password);
        }

        if(req.user.is_admin && user.is_admin !== undefined) {
            updatedUser.is_admin = user.is_admin;
        }

        if (Object.keys(updatedUser).length !== 0) {

            const result = await User.updateOne({ _id: id }, updatedUser);
            if (!result || result.matchedCount === 0) {
                return res.status(404).json({ success: false, errors: [{
                    field: "",
                    message: "User not found"
                }] });
            }

            if (result.modifiedCount === 0) {
                return res.status(200).json({ success: true, message: "No changes were made" });
            }

            return res.status(200).json({ success: true, message: "User updated successfully" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, errors: [{
            field: "",
            message: error.message
        }] });
    }
}

export const delete_user = async function(req, res) {
    try {
        const id = req.params.userId;
        const user = await User.findOneAndDelete({ _id: id }, null);
        if (!user) {
            return res.status(404).json({ success: false, errors: [{
                    field: "",
                    message: "User not found."
                }] });
        }
        return res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, errors: [{
                field: "",
                message: error.message
            }] });
    }
}

export const get_user = async function(req, res) {
    try {
        const id = req.params.userId;
        const user = await User.findOne({ _id: id }, "-password").exec();
        if (!user) {
            return res.status(404).json({ success: false, errors: [{
                field: "",
                message: "User not found"
            }] });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, errors: [{
            field: "",
            message: error.message
        }] });
    }
}

export const get_all_users = async function(req, res) {
    try {
        //Exclude itself
        const users = await User.find({ _id: { $ne: req.user.id } }).select('-password').exec();

        return res.status(200).json({
            success: true,
            count: users.length,
            users: users
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