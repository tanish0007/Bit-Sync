import { Router } from 'express';
import { addToHistory, getUserDashboard, getUserHistory,login, register ,logout} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js"

const router = Router();

router.get("/dashboard", protect, getUserDashboard)
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(protect, addToHistory);
router.route("/all_activity").get(protect, getUserHistory);
router.post("/logout", logout);

export default router;