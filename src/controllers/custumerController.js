// import Customer from "../models/Customer.js";
// import Order from "../models/Order.js";

// /**
//  * Create new customer
//  * POST /api/customers
//  */
// export const createCustomer = async (req, res) => {
//   try {
//     const { name, phone } = req.body;

//     // Basic validation
//     if (!name || name.trim() === "") {
//       return res.status(400).json({ message: "Name is required" });
//     }

//     // Check if phone already exists (since it's unique)
//     if (phone) {
//       const existing = await Customer.findOne({ phone });
//       if (existing) {
//         return res.status(400).json({
//           message: "Phone number already registered for another customer",
//         });
//       }
//     }

//     const customer = new Customer({
//       name,
//       phone: phone || null,
//       creditBalance: 0,
//     });

//     await customer.save();

//     res.status(201).json({
//       message: "Customer created successfully",
//       customer,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * Get all customers
//  * GET /api/customers
//  */
// export const getAllCustomers = async (req, res) => {
//   try {
//     const customers = await Customer.find().sort({ createdAt: -1 });
//     res.json({ message: "Customers fetched", customers });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /**
//  * Get single customer and their orders
//  * GET /api/customers/:id
//  */
// export const getCustomerById = async (req, res) => {
//   try {
//     const customer = await Customer.findById(req.params.id);
//     if (!customer)
//       return res.status(404).json({ message: "Customer not found" });

//     const orders = await Order.find({ customer: customer._id }).populate(
//       "items.product"
//     );
//     res.json({ customer, orders });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

/////WITH ADUDIT FIELDS AND ROLES IN MIDDLEWARE/////
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";

/**
 * Create new customer
 * POST /api/customers
 */
export const createCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    if (phone) {
      const existing = await Customer.findOne({ phone, status: "active" });
      if (existing) {
        return res.status(400).json({
          message: "Phone number already registered for another customer",
        });
      }
    }

    const customer = new Customer({
      name,
      phone: phone || null,
      creditBalance: 0,
      createdBy: req.user._id, // audit
    });

    await customer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all customers (only active)
 * GET /api/customers
 */
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ status: "active" }).sort({
      createdAt: -1,
    });
    res.json({ message: "Customers fetched", customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single customer and their orders
 * GET /api/customers/:id
 */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      status: "active",
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const orders = await Order.find({ customer: customer._id }).populate(
      "items.product"
    );
    res.json({ customer, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update customer
 * PUT /api/customers/:id
 */
export const updateCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const customer = await Customer.findOne({
      _id: req.params.id,
      status: "active",
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (phone) {
      const existing = await Customer.findOne({
        phone,
        _id: { $ne: customer._id },
        status: "active",
      });
      if (existing) {
        return res.status(400).json({
          message: "Phone number already registered for another customer",
        });
      }
    }

    customer.name = name || customer.name;
    customer.phone = phone || customer.phone;
    customer.updatedBy = req.user._id; // audit

    await customer.save();

    res.json({ message: "Customer updated", customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Soft delete customer
 * DELETE /api/customers/:id
 */
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      status: "active",
    });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    customer.status = "deleted";
    customer.deletedAt = new Date();
    customer.deletedBy = req.user._id; // audit

    await customer.save();

    res.json({ message: "Customer deleted (soft delete)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
