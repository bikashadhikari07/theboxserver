// routes/paymentRoutes.js
import express from "express";
import {
  updatePayment,
  getPaymentHistory,
} from "../controllers/PaymentController.js";
import { protect, isAdmin, hasRole } from "../middleware/auth.js";

///for testing i have remove protect and amdin only
/// on prod it will be used

const router = express.Router();

// 🔹 Make a payment for a specific order (cash, partial, credit)
router.post("/order/:id", protect, hasRole("admin", "cashier"), updatePayment);

// 🔹 Get payment history for a specific order
router.get(
  "/order/:orderId",
  protect,
  hasRole("admin", "cashier"),
  getPaymentHistory
);

export default router;
