import { Router } from "express";
import { sendOTP, verifyOTPAndRegister } from "../controllers/auth.controller.js";

const router = Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPAndRegister);

export default router;
