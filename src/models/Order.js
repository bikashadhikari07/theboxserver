// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   tableNo: { type: String, default: null },

//   customer: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Customer",
//     default: null,
//   },

//   customerName: { type: String, default: null },

//   items: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       quantity: Number,
//       remarks: String,
//     },
//   ],

//   total: { type: Number, required: true },
//   remarks: String,
//   source: String,

//   amountPaid: { type: Number, default: 0 },

//   paymentMethod: {
//     type: String,
//     enum: ["cash", "card", "credit", "unpaid"],
//     default: "unpaid",
//   },

//   paymentStatus: {
//     type: String,
//     enum: ["pending", "partial", "paid"],
//     default: "pending",
//   },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//   placedBy: { type: String, default: null },

//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Order", orderSchema);
// --- IGNORE ---

// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     // =========================
//     // Order Context
//     // =========================
//     tableNo: { type: String, default: null },

//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer",
//       default: null,
//     },

//     customerName: { type: String, default: null },

//     // =========================
//     // Items
//     // =========================
//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         quantity: { type: Number, required: true },
//         remarks: { type: String, default: null },
//       },
//     ],

//     // =========================
//     // Financials
//     // =========================
//     total: { type: Number, required: true },
//     amountPaid: { type: Number, default: 0 },

//     paymentMethod: {
//       type: String,
//       enum: ["cash", "card", "credit", "unpaid"],
//       default: "unpaid",
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["pending", "partial", "paid"],
//       default: "pending",
//     },

//     // =========================
//     // Meta
//     // =========================
//     remarks: { type: String, default: null },
//     source: { type: String, required: true }, // "waiter-app" | "pos"

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     placedBy: { type: String, default: null },

//     // =========================
//     // 🧾 AUDIT & SOFT DELETE
//     // =========================
//     status: {
//       type: String,
//       enum: ["active", "cancelled", "deleted"],
//       default: "active",
//     },

//     deletedAt: {
//       type: Date,
//       default: null,
//     },

//     deletedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     deleteReason: {
//       type: String,
//       default: null,
//     },
//   },
//   {
//     timestamps: true, // replaces manual createdAt
//   }
// );

// export default mongoose.model("Order", orderSchema);

///with actual change logs for audit trail
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    tableNo: { type: String, default: null },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    customerName: { type: String, default: null },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        remarks: { type: String, default: null },
      },
    ],
    total: { type: Number, required: true },
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
    remarks: { type: String, default: null },
    source: { type: String, required: true }, // "waiter-app" | "pos"
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    placedBy: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "cancelled", "deleted"],
      default: "active",
    },
    deletedAt: { type: Date, default: null },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deleteReason: { type: String, default: null },

    // =========================
    // Audit log
    // =========================
    auditLog: [
      {
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        action: { type: String }, // e.g., "create_order", "update_items", "update_payment", "update_remarks"
        timestamp: { type: Date, default: Date.now },
        changes: { type: Object }, // old vs new
        note: { type: String, default: null },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
