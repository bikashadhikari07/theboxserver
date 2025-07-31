// ========== 📁 src/routes/auth.js ==========
import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  savePushToken, // ✅
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// ✅ Add push token route
// router.post("/save-token", protect, savePushToken);
export default router;
