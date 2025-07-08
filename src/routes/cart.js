// import express from "express";
// import { protect } from "../middleware/auth.js";
// import {
//   addToCart,
//   getCart,
//   removeFromCart,
// } from "../controllers/cartController.js";

// const router = express.Router();

// router.post("/", protect, addToCart);
// router.get("/", protect, getCart);
// router.delete("/:productId", protect, removeFromCart);

// export default router;

// routes/cartRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router
  .route("/")
  .post(protect, addToCart) // Add to cart
  .get(protect, getCart) // Get cart
  .delete(protect, clearCart); // Clear all items

router
  .route("/:productId")
  .put(protect, updateCartItem) // Update quantity
  .delete(protect, removeFromCart); // Remove one item

export default router;
