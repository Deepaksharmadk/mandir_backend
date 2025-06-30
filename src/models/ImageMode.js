import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: [Object],
            required: true,
        },
        creater: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    },
);

const ImageModel = mongoose.model("Image", imageSchema);

export { ImageModel };
