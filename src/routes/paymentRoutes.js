// routes/paymentRoutes.js
import express from "express";
import {
  updatePayment,
  getPaymentHistory,
} from "../controllers/PaymentController.js";
import { protect, isAdmin } from "../middleware/auth.js";

///for testing i have remove protect and amdin only
/// on prod it will be used

const router = express.Router();

// 🔹 Make a payment for a specific order (cash, partial, credit)
router.post("/order/:id", protect, isAdmin, updatePayment);

// 🔹 Get payment history for a specific order
router.get("/order/:orderId", protect, isAdmin, getPaymentHistory);

export default router;
