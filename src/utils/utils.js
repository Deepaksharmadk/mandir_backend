import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
    return await argon2.hash(password);
};

export const verifyPassword = async (hash, password) => {
    return await argon2.verify(hash, password);
};

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
    });
};
