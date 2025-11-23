import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database.js";

//Load Routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";

import orderRoutes from "./routes/order.js";
import customerRoutes from "./routes/customerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/payments", paymentRoutes);
// Health check
app.get("/", (req, res) => {
  res.send("✅ E-commerce API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
