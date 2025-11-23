import Customer from "../models/Customer.js";
import Order from "../models/Order.js";

/**
 * Create new customer
 * POST /api/customers
 */
export const createCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Basic validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if phone already exists (since it's unique)
    if (phone) {
      const existing = await Customer.findOne({ phone });
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
 * Get all customers
 * GET /api/customers
 */
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
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
    const customer = await Customer.findById(req.params.id);
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
