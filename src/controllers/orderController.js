import Order from "../models/Order.js";
import Product from "../models/Product.js";

const VALID_TABLES = [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
  "Table 8",
];

export const createWaiterOrder = async (req, res) => {
  try {
    const { tableNo, items, remarks } = req.body;
    const user = req.user;

    if (!tableNo || !VALID_TABLES.includes(tableNo)) {
      return res.status(400).json({ message: "Invalid or missing tableNo" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Fetch all products referenced in items once
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return res
        .status(400)
        .json({ message: "One or more product IDs are invalid" });
    }

    // Map products by id for quick access
    const productMap = products.reduce((acc, p) => {
      acc[p._id.toString()] = p;
      return acc;
    }, {});

    // ✅ Validate stock for each item
    for (const item of items) {
      const product = productMap[item.product.toString()];
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    // ✅ Deduct stock
    for (const item of items) {
      const product = productMap[item.product.toString()];
      product.stock -= item.quantity;
      await product.save();
    }

    // Prepare order items with remarks
    const populatedItems = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      remarks: item.remarks || "",
    }));

    // Calculate total
    const total = populatedItems.reduce((acc, item) => {
      const product = productMap[item.product.toString()];
      return acc + product.price * item.quantity;
    }, 0);

    // Create order document
    const order = await Order.create({
      user: user._id,
      tableNo,
      placedBy: user.name,
      remarks,
      items: populatedItems,
      total,
      source: "box-app",
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error("Create waiter order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * For waiter app (box-app) users
 * POST /api/orders/waiter
 */
// export const createWaiterOrder = async (req, res) => {
//   try {
//     const { tableNo, items, remarks } = req.body;
//     const user = req.user;

//     if (!tableNo || !VALID_TABLES.includes(tableNo)) {
//       return res.status(400).json({ message: "Invalid or missing tableNo" });
//     }

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Items are required" });
//     }

//     // Fetch all products referenced in items once
//     const productIds = items.map((i) => i.product);
//     const products = await Product.find({ _id: { $in: productIds } });
//     if (products.length !== productIds.length) {
//       return res
//         .status(400)
//         .json({ message: "One or more product IDs are invalid" });
//     }

//     // Map products by id for quick access
//     const productMap = products.reduce((acc, p) => {
//       acc[p._id.toString()] = p;
//       return acc;
//     }, {});

//     // Prepare order items with validation and remarks
//     const populatedItems = items.map((item) => ({
//       product: item.product,
//       quantity: item.quantity,
//       remarks: item.remarks || "",
//     }));

//     // Calculate total
//     const total = populatedItems.reduce((acc, item) => {
//       const product = productMap[item.product.toString()];
//       return acc + product.price * item.quantity;
//     }, 0);

//     // Create order document
//     const order = await Order.create({
//       user: user._id,
//       tableNo,
//       placedBy: user.name,
//       remarks,
//       items: populatedItems,
//       total,
//       source: "box-app",
//     });

//     res.status(201).json({ message: "Order placed", order });
//   } catch (err) {
//     console.error("Create waiter order error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const createWaiterOrder = async (req, res) => {
//   try {
//     const { tableNo, items, remarks } = req.body;
//     const user = req.user;

//     if (!tableNo || !VALID_TABLES.includes(tableNo)) {
//       return res.status(400).json({ message: "Invalid or missing tableNo" });
//     }

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Items are required" });
//     }

//     // Fetch all products referenced in items once
//     const productIds = items.map((i) => i.product);
//     const products = await Product.find({ _id: { $in: productIds } });
//     if (products.length !== productIds.length) {
//       return res
//         .status(400)
//         .json({ message: "One or more product IDs are invalid" });
//     }

//     // Map products by id for quick access
//     const productMap = products.reduce((acc, p) => {
//       acc[p._id.toString()] = p;
//       return acc;
//     }, {});

//     // ✅ Validate stock for each item
//     for (const item of items) {
//       const product = productMap[item.product.toString()];
//       if (!product) {
//         return res.status(400).json({ message: `Product ${item.product} not found` });
//       }
//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           message: `Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
//         });
//       }
//     }

//     // ✅ Deduct stock
//     for (const item of items) {
//       const product = productMap[item.product.toString()];
//       product.stock -= item.quantity;
//       await product.save();
//     }

//     // Prepare order items with remarks
//     const populatedItems = items.map((item) => ({
//       product: item.product,
//       quantity: item.quantity,
//       remarks: item.remarks || "",
//     }));

//     // Calculate total
//     const total = populatedItems.reduce((acc, item) => {
//       const product = productMap[item.product.toString()];
//       return acc + product.price * item.quantity;
//     }, 0);

//     // Create order document
//     const order = await Order.create({
//       user: user._id,
//       tableNo,
//       placedBy: user.name,
//       remarks,
//       items: populatedItems,
//       total,
//       source: "box-app",
//     });

//     res.status(201).json({ message: "Order placed", order });

//   } catch (err) {
//     console.error("Create waiter order error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/**
 * Admin - Get all orders
 * GET /api/admin/orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch all orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Admin - Update order status
 * PUT /api/admin/orders/:id
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Status updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Admin - Delete order
 * DELETE /api/admin/orders/:id
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Admin POS order
 * POST /api/orders/pos
 */
export const createPOSOrder = async (req, res) => {
  try {
    const { guestName, user, items, total, remarks } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    const formattedItems = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      remarks: item.remarks || "",
    }));

    const orderData = {
      items: formattedItems,
      total,
      source: "pos",
      remarks,
    };

    if (user) orderData.user = user;
    else if (guestName) orderData.guestName = guestName;
    else return res.status(400).json({ message: "Guest or user required" });

    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (err) {
    console.error("Create POS order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get orders for current logged-in user (waiter app)
 * GET /api/orders/my
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch user orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
