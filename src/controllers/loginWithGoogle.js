import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyIdToken } from "../utils/googleAuthService.js";
import { User } from "../models/userModel.model.js";
import { id } from "zod/v4/locales";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);
export const loginWithGoogle = async (req, res, next) => {
    const { idToken } = req.body;

    try {
        const userData = await verifyIdToken(idToken);
        // console.log(`token`, idToken);
        const { name, email, picture } = userData;
        // console.log(`google data`, userData);

        let user = await User.findOne({ email }).select("-__v");

        if (user) {
            if (user.deleted) {
                return res.status(403).json({
                    error: "Your account has been deleted. Contact app owner to recover.",
                });
            }

            if (!user.picture.includes("googleusercontent.com")) {
                user.picture = picture;
                await user.save();
            }
        } else {
            user = await User.create({ name, email, picture });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" },
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // send only over HTTPS in production
            // sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            message: "logged in",
        });
    } catch (err) {
        next(err);
    }
};
