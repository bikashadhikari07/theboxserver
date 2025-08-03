// routes/orderRoutes.js
import express from "express";
import {
  createWaiterOrder,
  createPOSOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} from "../controllers/orderController.js";

import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/waiter", protect, createWaiterOrder);
router.post("/pos", protect, isAdmin, createPOSOrder);

router.get("/my", protect, getMyOrders);

router.get("/admin/orders", protect, isAdmin, getAllOrders);
router.put("/admin/orders/:id", protect, isAdmin, updateOrderStatus);
router.delete("/admin/orders/:id", protect, isAdmin, deleteOrder);

export default router;
