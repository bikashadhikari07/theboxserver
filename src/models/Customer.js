import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  creditBalance: { type: Number, default: 0 }, // Total unpaid amount
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Customer", customerSchema);
