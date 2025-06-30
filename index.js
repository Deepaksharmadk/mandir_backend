import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.db.js";
import authRoutes from "./src/routes/auth.route.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
//clodinary setup

// --- Middlewares ---
// To parse JSON request bodies
app.use(express.json());
//serve the static files
app.use(express.static("public"));
// To parse cookies
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }),
);

// --- API Routes ---
import uploadRoutes from "./src/routes/imageRoute.js";
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/upload", uploadRoutes);

app.get("/health", (req, res) => {
    res.json({ message: "API is running..." });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
