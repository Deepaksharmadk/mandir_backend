import { User } from "../models/userModel.model.js";
import { generateToken, verifyPassword } from "../utils/utils.js";
import argon2 from "argon2";

import { loginSchema, signupSchema } from "../validators/auth.validator.js";

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
