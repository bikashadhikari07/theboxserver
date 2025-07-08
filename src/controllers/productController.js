import Product from "../models/Product.js";

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products with optional filtering by discount and category
export const getProducts = async (req, res) => {
  try {
    const { discount, category, search } = req.query;

    let filter = {};

    if (discount) filter.discount = { $gt: 0 };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product by ID (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product by ID (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk Create Products (Admin only)
export const bulkCreateProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Provide an array of products" });
    }

    const inserted = await Product.insertMany(products);
    res
      .status(201)
      .json({
        message: `${inserted.length} products created`,
        products: inserted,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
