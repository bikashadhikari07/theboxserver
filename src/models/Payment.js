import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

  amount: { type: Number, required: true }, // Can be 0 for credit
  method: {
    type: String,
    enum: ["cash", "card", "credit", "esewa", "khalti"],
    required: true,
  },

  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
