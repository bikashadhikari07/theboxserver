import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
} from "../controllers/custumerController.js";
import { protect, isAdmin, hasRole } from "../middleware/auth.js";

const router = express.Router();

// Only admin/cashier can see customers
router.get("/", protect, hasRole("admin", "cashier"), getAllCustomers);
router.get("/:id", protect, hasRole("admin", "cashier"), getCustomerById);
router.post("/", protect, hasRole("admin", "cashier"), createCustomer);

export default router;
