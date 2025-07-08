import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
} from "../controllers/productController.js";

import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, isAdmin, createProduct);
router.post("/bulk", bulkCreateProducts); // <-- New route for bulk create// Only admins can create

router
  .route("/:id")
  .get(getProductById)
  .put(protect, isAdmin, updateProduct) // Only admins can update
  .delete(protect, isAdmin, deleteProduct); // Only admins can delete

export default router;
