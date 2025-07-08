// import express from "express";
// import {
//   createBusiness,
//   getBusinessByAdmin,
//   updateBusinessConfig,
// } from "../controllers/businessController.js";
// import { protect, isSuperAdmin, isAdmin } from "../middleware/auth.js";

// const router = express.Router();

// // 🛠 Create business – superadmin only
// router.post("/", protect, isSuperAdmin, createBusiness);

// // 📄 Get business info – admin/superadmin
// router.get("/", protect, isAdmin, getBusinessByAdmin);

// // ✏️ Update business config – admin/superadmin
// router.put("/", protect, isAdmin, updateBusinessConfig);

// export default router;
