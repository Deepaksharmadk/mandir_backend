import { Router } from "express";
import { upload } from "../utils/multer.js";
import { uploadImage } from "../controllers/imageController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, upload.array("image", 50), uploadImage);

export default router;
