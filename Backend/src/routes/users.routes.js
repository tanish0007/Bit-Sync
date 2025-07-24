import { Router } from 'express';
import {addToHistory, getUserHistory,login, register} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js"

const router = Router();


router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(protect, addToHistory);
router.route("/all_activity").get(protect, getUserHistory);

export default router;