import { z } from "zod";

/**
 * Validate incoming payload for /register
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().regex(emailRegex, "Invalid email address"),
    password: z.string().regex(passwordRegex, "Invalid password"),
});
export const loginSchema = z.object({
    email: z.string().regex(emailRegex, "Invalid email address"),
    password: z.string().regex(passwordRegex, "Invalid password"),
});

export const forgotPasswordValidator = z.object({
    email: z.string().regex(emailRegex, "Invalid email address"),
});

export const resetPasswordOTPValidator = z.object({
    email: z.string().regex(emailRegex, "Invalid email address"),
    otp: z.string(),
    password: z.string().regex(passwordRegex, "Invalid password"),
});
