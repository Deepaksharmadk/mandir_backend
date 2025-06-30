import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"], // Define possible roles
            default: "user", // Set a default role
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    },
);

const User = mongoose.model("User", userSchema);

export { User };
