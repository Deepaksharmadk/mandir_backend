import { Router } from "express";
import { upload } from "../utils/multer.js";
import { GetallImages, uploadImage } from "../controllers/imageController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, upload.array("image", 50), uploadImage);
//create get route to get all images
router.get("/all-images", GetallImages);

export default router;
