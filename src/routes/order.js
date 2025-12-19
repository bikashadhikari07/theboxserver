// // routes/orderRoutes.js
// import express from "express";
// import {
//   createWaiterOrder,
//   createPOSOrder,
//   getAllOrders,
//   updateOrderStatus,
//   deleteOrder,
//   getMyOrders,
//   getPendingPayments,
//   getPartialPayments,
//   getOrderPayments,
//   getCustomerPayments,
// } from "../controllers/orderController.js";

// import { protect, isAdmin } from "../middleware/auth.js";

// const router = express.Router();

// // --- Order Creation Routes ---
// router.post("/waiter", protect, createWaiterOrder);
// router.post("/pos", protect, isAdmin, createPOSOrder);

// router.get("/my", protect, getMyOrders);

// // --- Admin Order Management ---
// router.get("/admin/orders", protect, isAdmin, getAllOrders);
// router.put("/admin/orders/:id", protect, isAdmin, updateOrderStatus);
// router.delete("/admin/orders/:id", protect, isAdmin, deleteOrder);

// // --- Payment Status Queries ---
// router.get("/pending", protect, isAdmin, getPendingPayments);
// router.get("/payments/partial", protect, isAdmin, getPartialPayments);

// // --- 🔥 DEDICATED PAYMENT/CREDIT ROUTES (Replaces old updatePayment) 🔥 ---

// // 1. Route to pay for a specific order
// router.post("/pay/:id", protect, isAdmin, createOrderPayment);

// // 2. Route for a customer to settle their old accrued debt
// // Note: Using 'customerId' in the path for clarity
// router.post(
//   "/settle-credit/:customerId",
//   protect,
//   isAdmin,
//   createCreditSettlement
// );

// // --- Payment History Lookups ---

// // Payment history for a specific customer
// router.get("/customer/:customerId", protect, isAdmin, getCustomerPayments);

// // Payment history for a specific order
// router.get("/order/:orderId", protect, isAdmin, getOrderPayments);

// // Note: Removed redundant/commented-out routes and cleaned up the structure.

// export default router;

///
import express from "express";
import {
  createWaiterOrder,
  createPOSOrder,
  getAllOrders,
  getMyOrders,
  updateWaiterOrder,
  deleteOrderById,
} from "../controllers/orderController.js";

import { protect, isAdmin, hasRole } from "../middleware/auth.js";

const router = express.Router();

// --- Order Creation Routes ---
router.post("/waiter", protect, hasRole("waiter"), createWaiterOrder);
router.put(
  "/waiter/:id",
  protect,
  hasRole("waiter", "admin"),
  updateWaiterOrder
);

router.delete("/:id", protect, hasRole("admin", "cashier"), deleteOrderById);

router.post("/pos", protect, hasRole("admin", "cashier"), createPOSOrder);

// --- Current User Orders ---
router.get("/my", protect, hasRole("user", "waiter"), getMyOrders);

// --- Admin Order Management ---
router.get("/admin/orders", protect, hasRole("admin"), getAllOrders);

export default router;
