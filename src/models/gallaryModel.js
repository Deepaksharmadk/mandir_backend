import mongoose from "mongoose";
const galleryImageSchema = new mongoose.Schema(
    {
        imageName: {
            type: String,
            required: true,
            trim: true,
        },
        imageUrl: {
            type: String,
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
const GalleryImageModel = mongoose.model("GalleryImage", galleryImageSchema);
export { GalleryImageModel };
