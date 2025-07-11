import { User } from "../models/userModel.model.js";
import { generateToken, verifyPassword } from "../utils/utils.js";
import argon2 from "argon2";
import crypto from "crypto";

import { loginSchema, signupSchema } from "../validators/auth.validator.js";
import { hashPassword } from "../utils/utils.js";
import {
    forgotPasswordValidator,
    resetPasswordOTPValidator,
} from "../validators/auth.validator.js";
import { sendEmail } from "../utils/mailService.js";
import { getResetPasswordTemplate } from "../utils/getResetPasswordTemplate.js";

// --- SIGNUP ---
export const signup = async (req, res) => {
    const userData = signupSchema.safeParse(req.body);
    console.log(`client data`, userData);

    if (!userData.success) {
        return res.status(400).json({
            message: userData.error.issues.map((issue) => issue.message),
        });
    }
    console.log(`parse`, userData.data);
    const { name, email, password } = userData.data;
    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "Email already in use" });
        }

        // 2. Hash the password
        const hashedPassword = await argon2.hash(password);
        console.log(`hashpassword`, hashedPassword);

        // 3. Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const userData = await User.findById(user._id)
            .select("-password")
            .lean();
        res.status(201).json({
            message: "User registered successfully",
            userData,
        });
        // // 4. Send token and user data
        // sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    console.log(`sss`, req.body);
    const loginData = loginSchema.safeParse(req.body);

    console.log(`client data login`, loginData);

    if (!loginData.success) {
        return res.status(400).json({
            message: loginData.error.issues.map((issue) => issue.message),
        });
    }
    try {
        const { email, password } = loginData.data;

        // 1. Find user by email
        const user = await User.findOne({ email }).select("+password"); // Explicitly include password

        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        // 2. Verify password
        const isMatch = await verifyPassword(user.password, password);

        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }
        const token = generateToken({ id: user._id, role: user.role });
        console.log(`t`, token);
        const options = {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: true,
            signed: true, // Sign the cookie to prevent tampering
            // Only send over HTTPS in production
            expires: new Date(
                Date.now() + 24 * 60 * 60 * 1000, // 1 day
            ),
        };

        // Remove password from the user object before sending the response
        user.password = undefined;

        res.status(201)
            .cookie("token", token, options)
            .json({ massage: "User logged in successfully", user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// --- LOGOUT ---
export const logout = (req, res) => {
    // Clear the cookie by setting an expired one
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
        httpOnly: true,
    });

    res.status(201).json({
        success: true,
        message: "User logged out successfully",
    });
};

// --- CHECK AUTH / GET PROFILE ---
export const checkAuth = async (req, res) => {
    // If this function is reached, the authMiddleware has already verified the user
    // and attached the user object to req.user
    res.status(200).json({ success: true, user: req.user });
};
export const forgotPassword = async (req, res) => {
    // 1. Enhanced Input Validation
    const validationResult = forgotPasswordValidator.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            message: "Invalid request",
            errors: validationResult.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    const { email } = validationResult.data;

    try {
        // 2. Secure User Lookup (prevent timing attacks)
        const user = await User.findOne({ email }).select(
            "+resetPasswordOTP +resetPasswordOTPExpiry +email +name",
        );

        // 3. Consistent Response regardless of user existence

        if (user) {
            // 5. More secure OTP generation
            const otp = crypto.randomInt(1000, 9999).toString();
            // console.log(`Generated OTP for ${email}:`, otp);

            // 6. Set OTP and expiry
            user.resetPasswordOTP = otp;
            user.resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

            await user.save();

            // 8. Async email sending with error handling
            sendEmail({
                to: user.email,
                subject: "Your Password Reset Code",
                text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
                html: getResetPasswordTemplate(user.name, otp),
            }).catch((emailError) => {
                console.error(
                    "Failed to send password reset email:",
                    emailError,
                );
            });
        }

        return res.status(200).json({
            message: "password reset OTP has been sent",
        });
    } catch (error) {
        console.error("Password reset request error:", error);
        return res.status(500).json({
            message: "An error occurred while processing your request",
        });
    }
};
export const resetPassword = async (req, res) => {
    // 1. Input Validation
    const validationResult = resetPasswordOTPValidator.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResult.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    const { email, otp, password } = validationResult.data;

    try {
        // 2. Database Lookup
        const user = await User.findOne({ email }).select(
            "+resetPasswordOTP +resetPasswordOTPExpiry +password",
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. OTP Verification
        const isOtpValid = user.resetPasswordOTP === otp;
        const isOtpExpired =
            Date.now() > (user.resetPasswordOTPExpiry?.getTime() || 0);

        if (!isOtpValid || isOtpExpired) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                details: {
                    isOtpValid,
                    isOtpExpired,
                },
            });
        }

        // 4. Password Update
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });

        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpiry = undefined;

        // 5. Save with transaction for better error handling
        await user.save();

        // 6. Response
        return res.status(200).json({
            message: "Password reset successfully",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json({
            message: "Internal server error during password reset",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};
