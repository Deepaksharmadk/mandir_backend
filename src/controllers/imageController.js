// controllers/image.controller.js
import { ImageModel } from "../models/ImageMode.js";
import fs from "fs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { join } from "path";
const { dirname } = import.meta;
// console.log(` dir ${process.cwd()}`);
// Step 3: Build path to /public/temp from current file
const tempDir = join(dirname, "..", "..", "public", "temp");
// console.log(tempDir);

export const uploadImage = async (req, res) => {
    const localCloudUrls = [];
    const uploadedFiles = req.files || [];

    if (!uploadedFiles.length) {
        return res.status(400).json({ message: "No files uploaded." });
    }

    try {
        for (const file of uploadedFiles) {
            const filePath = file.path;
            const result = await uploadOnCloudinary(filePath);

            if (result?.secure_url) {
                localCloudUrls.push(result.secure_url);
            } else {
            }
        }

        if (!localCloudUrls.length) {
            return res
                .status(500)
                .json({ message: "Upload to Cloudinary failed." });
        }

        const savedData = await ImageModel.create({
            imageUrl: localCloudUrls,
            creater: req.user._id,
        });

        return res.status(201).json({
            message: "✅ File(s) uploaded successfully",
            userUploadedData: savedData,
        });
    } catch (error) {
        // console.error("❌ Unexpected error during upload:", error);
        return res.status(500).json({ error: error.message });
    } finally {
        for (const file of uploadedFiles) {
            try {
                const fullPath = join(tempDir, file.filename);
                fs.unlinkSync(fullPath);
            } catch (err) {
                // console.warn(
                //     `⚠️ Cleanup failed for ${file.filename}:`,
                //     err.message,
                // );
            }
        }
    }
};
