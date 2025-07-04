import jwt from "jsonwebtoken";
import { User } from "../models/userModel.model.js";

export const protect = async (req, res, next) => {
    let token;

    // Check if token exists in cookies
    if (req.signedCookies && req.signedCookies.token) {
        token = req.signedCookies.token;
    }

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, no token" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from token payload, but exclude the password
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, message: "User not found" });
        }

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, message: "Not authorized, token failed" });
    }
};

// Middleware to check for a specific role (e.g., 'admin')
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
