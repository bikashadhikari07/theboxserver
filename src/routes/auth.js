// ========== 📁 src/routes/auth.js ==========
import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  createStaff,
} from "../controllers/authController.js";
import { isAdmin, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.post("/staff", protect, isAdmin, createStaff);

export default router;
