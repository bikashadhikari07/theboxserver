import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
} from "../controllers/custumerController.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Only admin/cashier can see customers
router.get("/", protect, isAdmin, getAllCustomers);
router.get("/:id", protect, isAdmin, getCustomerById);
router.post("/", protect, isAdmin, createCustomer);

export default router;
