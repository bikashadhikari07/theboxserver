import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

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

/**
 * ==========================================================
 *  1️⃣  CREATE WAITER ORDER
 * ==========================================================
 * POST /api/orders/waiter
 */
export const createWaiterOrder = async (req, res) => {
  try {
    const { tableNo, items, remarks } = req.body;
    const user = req.user;

    if (!tableNo || !VALID_TABLES.includes(tableNo)) {
      return res.status(400).json({ message: "Invalid table number" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Fetch all products in one query
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: "Invalid product in list" });
    }

    // Map products
    const productMap = {};
    products.forEach((p) => {
      productMap[p._id] = p;
    });

    // Check stock
    for (const item of items) {
      const product = productMap[item.product];
      if (product.requiresStock && product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }
    }

    // Deduct stock
    for (const item of items) {
      const product = productMap[item.product];
      if (product.requiresStock) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Calculate total
    const total = items.reduce((sum, item) => {
      const p = productMap[item.product];
      return sum + p.price * item.quantity;
    }, 0);

    const order = await Order.create({
      user: user._id,
      tableNo,
      placedBy: user.name,
      remarks,
      items,
      total,
      paymentMethod: "unpaid",
      paymentStatus: "pending",
      source: "waiter-app",
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    console.error("Create waiter order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ==========================================================
 *  2️⃣  ADMIN - GET ALL ORDERS
 * ==========================================================
 * GET /api/admin/orders
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email phone creditBalance")
      .populate("items.product", "name price")
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ==========================================================
 *  3️⃣  GET ORDERS OF CURRENT WAITER
 * ==========================================================
 * GET /api/orders/my
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPOSOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      items,
      paymentMethod, // expected: "unpaid" | "cash" | "credit"
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // 1️⃣ Fetch all product details from DB
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({
        message: "One or more products are invalid",
      });
    }

    // Create product map for quick lookup
    const productMap = {};
    products.forEach((p) => (productMap[p._id] = p));

    // 2️⃣ STOCK CHECK
    for (const item of items) {
      const p = productMap[item.product];
      if (!p) return res.status(400).json({ message: "Invalid product" });

      if (p.requiresStock && p.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${p.name}`,
        });
      }
    }

    // 3️⃣ Deduct stock
    for (const item of items) {
      const p = productMap[item.product];
      if (p.requiresStock) {
        p.stock -= item.quantity;
        await p.save();
      }
    }

    // 4️⃣ Recalculate total safely (never trust frontend)
    const total = items.reduce((sum, item) => {
      const p = productMap[item.product];
      return sum + p.price * item.quantity;
    }, 0);

    // 5️⃣ Auto-create or fetch customer
    let customer = null;

    if (customerPhone || customerName) {
      customer = await Customer.findOne({ phone: customerPhone });

      if (!customer) {
        customer = await Customer.create({
          name: customerName || "Unknown",
          phone: customerPhone || null,
        });
      }
    }

    // 6️⃣ Create POS Order
    const order = await Order.create({
      customer: customer?._id || null,
      customerName: customer ? customer.name : customerName || "Walk-In",
      items,
      total,
      source: "pos",
      amountPaid: 0,
      paymentMethod: paymentMethod || "unpaid",
      paymentStatus: "pending",
      user: req.user._id, // audit: who created the order
    });

    res.json({
      message: "POS order created",
      order,
    });
  } catch (err) {
    console.error("POS Order Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------------
// GET ALL POS ORDERS
// ------------------------
export const getPOSOrders = async (req, res) => {
  try {
    const orders = await Order.find({ source: "pos" }).populate("customer");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//update waiter order

// export const updateWaiterOrder = async (req, res) => {
//   try {
//     const { items, remarks } = req.body;
//     const user = req.user;

//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.user.toString() !== user._id.toString()) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Items required" });
//     }

//     // Restore previous stock
//     for (const item of order.items) {
//       const product = await Product.findById(item.product);
//       if (product?.requiresStock) {
//         product.stock += item.quantity;
//         await product.save();
//       }
//     }

//     // Fetch new products
//     const productIds = items.map((i) => i.product);
//     const products = await Product.find({ _id: { $in: productIds } });

//     const productMap = {};
//     products.forEach((p) => (productMap[p._id] = p));

//     // Check stock again
//     for (const item of items) {
//       const p = productMap[item.product];
//       if (!p) return res.status(400).json({ message: "Invalid product" });

//       if (p.requiresStock && p.stock < item.quantity) {
//         return res
//           .status(400)
//           .json({ message: `Not enough stock for ${p.name}` });
//       }
//     }

//     // Deduct new stock
//     for (const item of items) {
//       const p = productMap[item.product];
//       if (p.requiresStock) {
//         p.stock -= item.quantity;
//         await p.save();
//       }
//     }

//     // Recalculate total
//     const total = items.reduce(
//       (sum, i) => sum + productMap[i.product].price * i.quantity,
//       0
//     );

//     order.items = items;
//     order.total = total;
//     order.remarks = remarks || order.remarks;

//     await order.save();

//     res.json({ message: "Order updated", order });
//   } catch (err) {
//     console.error("Update waiter order error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
/// new and more advanced  audit
export const updateWaiterOrder = async (req, res) => {
  try {
    const { items, remarks, note } = req.body;
    const user = req.user;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Items required" });

    // Save old items for audit
    const oldItems = order.items.map((i) => ({ ...i._doc }));

    // Restore previous stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product?.requiresStock) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Fetch new products
    const productIds = items.map((i) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = {};
    products.forEach((p) => (productMap[p._id] = p));

    // Check stock
    for (const item of items) {
      const p = productMap[item.product];
      if (!p) return res.status(400).json({ message: "Invalid product" });
      if (p.requiresStock && p.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${p.name}` });
      }
    }

    // Deduct new stock
    for (const item of items) {
      const p = productMap[item.product];
      if (p.requiresStock) {
        p.stock -= item.quantity;
        await p.save();
      }
    }

    // Recalculate total
    const total = items.reduce(
      (sum, i) => sum + productMap[i.product].price * i.quantity,
      0
    );

    // Update order
    order.items = items;
    order.total = total;
    if (remarks) order.remarks = remarks;

    // Add audit log
    order.auditLog.push({
      updatedBy: user._id,
      action: "update_items",
      changes: {
        old: oldItems,
        new: items,
        oldRemarks: order.remarks,
        newRemarks: remarks,
      },
      note: note || null,
    });

    await order.save();

    res.json({ message: "Order updated", order });
  } catch (err) {
    console.error("Update waiter order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//
export const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "deleted") {
      return res.status(400).json({ message: "Order already deleted" });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);
      if (product?.requiresStock) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = "deleted";
    order.deletedAt = new Date();
    order.deletedBy = req.user._id;
    order.deleteReason = req.body.reason || "Admin removed order";

    await order.save();

    res.json({ message: "Order deleted (logged)" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
