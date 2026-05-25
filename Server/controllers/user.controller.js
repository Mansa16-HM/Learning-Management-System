import cloudinary from "cloudinary";
import crypto from 'crypto';
import fs from 'fs';

import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import User from "../models/usermodel.js";
import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false
};

/**
 * Register User
 */
export const register = asyncHandler(async (req, res, next) => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(new AppError('Email already exists', 409));
    }

    try {

        const user = await User.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url:
                    'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
            },
        });

        user.password = undefined;

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        });

    } catch (error) {

        return next(new AppError(error.message, 400));
    }
});


/**
 * Login User
 */
export const login = asyncHandler(async (req, res, next) => {
     console.log("LOGIN BODY:", req.body); 

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Email and Password are required', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new AppError('User not found', 400));
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return next(new AppError('Email or password does not match', 400));
        }

        const token = await user.generateJWTToken();

        user.password = undefined;

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'User logged in Successfully',
            user,
            token
        });

    } catch (e) {

        return next(new AppError(e.message, 500));
    }
});


/**
 * Logout User
 */
export const logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', null, {
        httpOnly: true,
        secure: false,
        maxAge: 0
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });

});


/**
 * Forgot Password
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {

    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('Email not registered', 400));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordUrl =
        `${process.env.FRONTEND_URL}reset-password/${resetToken}`;

    const subject = 'Reset Password';

    const message =
        `You can reset your password by clicking 
        <a href=${resetPasswordUrl} target="_blank">
        Reset your password
        </a>`;

    try {

        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token sent to ${email}`
        });

    } catch (e) {

        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;

        await user.save();

        return next(new AppError(e.message, 500));
    }
});


/**
 * Reset Password
 */
export const resetPassword = asyncHandler(async (req, res, next) => {

    const { resetToken } = req.params;

    const { password } = req.body;

    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError("Token is invalid or expired", 400));
    }

    user.password = password;

    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});


/**
 * Change Password
 */
export const changePassword = asyncHandler(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;

    const { id } = req.user;

    if (!oldPassword || !newPassword) {
        return next(new AppError("All fields are mandatory", 400));
    }

    const user = await User.findById(id).select('+password');

    if (!user) {
        return next(new AppError("User does not exist", 400));
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
        return next(new AppError("Invalid old password", 400));
    }

    user.password = newPassword;

    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});


/**
 * Update User
 */
export const updateUser = asyncHandler(async (req, res, next) => {

    const { fullName } = req.body;

    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError("User does not exist", 400));
    }

    if (fullName) {
        user.fullName = fullName;
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'User details updated successfully'
    });

});


/**
 * Get Profile
 */
export const getProfile = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new AppError("User does not exist", 400));
    }

    res.status(200).json({
        success: true,
        user
    });

});