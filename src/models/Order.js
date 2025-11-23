import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tableNo: { type: String, default: null },

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    default: null,
  },

  customerName: { type: String, default: null },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      remarks: String,
    },
  ],

  total: { type: Number, required: true },
  remarks: String,
  source: String,

  amountPaid: { type: Number, default: 0 },

  paymentMethod: {
    type: String,
    enum: ["cash", "card", "credit", "unpaid"],
    default: "unpaid",
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "partial", "paid"],
    default: "pending",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  placedBy: { type: String, default: null },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
