import { Router } from "express";
import { loginWithGoogle } from "../controllers/loginWithGoogle.js";

const router = Router();

router.post("/google", loginWithGoogle);

export default router;
