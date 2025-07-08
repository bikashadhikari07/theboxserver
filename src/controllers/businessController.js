// import Business from "../models/Business.js";

// // Create a new business – Superadmin only
// export const createBusiness = async (req, res) => {
//   try {
//     const { ownerId, storeName, heroImageUrl, contactInfo } = req.body;

//     const existing = await Business.findOne({ owner: ownerId });
//     if (existing)
//       return res
//         .status(400)
//         .json({ message: "Business already exists for this owner" });

//     const business = await Business.create({
//       owner: ownerId,
//       storeName,
//       heroImageUrl,
//       contactInfo,
//     });

//     res.status(201).json(business);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Get business by logged-in admin
// export const getBusinessByAdmin = async (req, res) => {
//   try {
//     const business = await Business.findOne({ owner: req.user._id }).populate(
//       "featuredProductIds"
//     );
//     if (!business)
//       return res.status(404).json({ message: "Business not found" });

//     res.json(business);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Update business config – Admin/Superadmin
// export const updateBusinessConfig = async (req, res) => {
//   try {
//     const updates = req.body;

//     const business = await Business.findOne({ owner: req.user._id });
//     if (!business)
//       return res.status(404).json({ message: "Business not found" });

//     Object.assign(business, updates);
//     await business.save();

//     res.json(business);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
