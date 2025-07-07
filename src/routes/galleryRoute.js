import { Router } from "express";
import { upload } from "../utils/multer.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadGalleryImage } from "../controllers/galleryCOntroller.js";

const router = Router();

router.post("/upload", protect, upload.array("image", 50), uploadGalleryImage);
//create get route to get all images
// router.get("/all-images", GetallImages);

export default router;
