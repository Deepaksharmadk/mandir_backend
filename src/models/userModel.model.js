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
            // required: true,
        },
        picture: {
            type: String,
            default:
                "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg",
        },
        role: {
            type: String,
            enum: ["Admin", "Manager", "User"],
            default: "User",
            // default: "user", // Set a default role
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    },
);

const User = mongoose.model("User", userSchema);

export { User };
