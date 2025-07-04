import express from "express";

import {
    checkAuth,
    login,
    logout,
    signup,
} from "../controllers/auth.Controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// We need a generic validation middleware to use Zod schemas

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected route
router.get("/profile", protect, checkAuth);

// Example of an admin-only route
router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the Admin Dashboard!",
    });
});

export default router;
