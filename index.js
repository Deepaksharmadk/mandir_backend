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

const jwtSecret = process.env.JWT_SECRET || "default";
// console.log(`JWT Secret: ${jwtSecret}`);
// --- Middlewares ---
// To parse JSON request bodies
app.use(express.json());
//serve the static files
app.use(express.static("public"));
// To parse cookies
app.use(cookieParser(jwtSecret));
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [process.env.ORIGIN, "http://localhost:3000"], // only allow this origin
        credentials: true,
        methods: ["GET", "POST"], // only allow GET and POST
    }),
);

// --- API Routes ---
import uploadRoutes from "./src/routes/imageRoute.js";
import loginWithGoogle from "./src/routes/loginWithGoogle.js";
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/image", uploadRoutes);
app.use("/api/v1/user", loginWithGoogle);

app.get("/health", (req, res) => {
    res.json({ message: "API is running..." });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
