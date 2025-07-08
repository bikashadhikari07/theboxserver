import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: function () {
//         return this.source !== "pos";
//       },
//     },
//     guestName: {
//       type: String,
//       required: function () {
//         return this.source === "pos" && !this.user;
//       },
//     },
//     tableNo: Number,
//     placedBy: String, // waiter name or admin
//     remarks: String,

//     items: [
//       {
//         product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//         quantity: Number,
//         remarks: String,
//       },
//     ],

//     total: Number,
//     status: { type: String, default: "Pending" },

//     source: {
//       type: String,
//       enum: ["box-app", "pos"], // only two now
//       default: "box-app",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestName: String,
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        remarks: { type: String, default: "" },
      },
    ],
    total: Number,
    status: { type: String, default: "Pending" },
    source: {
      type: String,
      enum: ["box-app", "pos", "waiter"],
      default: "waiter",
    },
    tableNo: {
      type: String,
      enum: [
        "Table 1",
        "Table 2",
        "Table 3",
        "Table 4",
        "Table 5",
        "Table 6",
        "Table 7",
        "Table 8",
      ],
      required: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
