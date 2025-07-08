// import mongoose from "mongoose";

// const businessSchema = new mongoose.Schema(
//   {
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },
//     storeName: { type: String, required: true },
//     description: String,
//     primaryColor: { type: String, default: "#10b981" },
//     footerAbout: String,
//     footerContact: String,
//     heroImageUrl: String,
//     featuredProductIds: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//     ],
//     contactInfo: {
//       phone: String,
//       email: String,
//       address: String,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Business", businessSchema);
