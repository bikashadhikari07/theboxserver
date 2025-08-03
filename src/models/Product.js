import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // discount percentage
    images: [String], // array of image URLs
    category: {
      type: String,
      enum: [
        "Fast Food",
        "Pizza",
        "Drinks",
        "Meals",
        "Snacks",
        "Hookah",
        "Beer",
        "Cocktail",
        "mocktails",
        "ALL-DAY BREAKFAST COMBOS",
      ],
    },
    stock: { type: Number, default: 0 },
    requiresStock: { type: Boolean, default: false },
    lowStockThreshold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
