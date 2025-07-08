// import Cart from "../models/Cart.js";

// export const addToCart = async (req, res) => {
//   const { productId, quantity } = req.body;
//   let cart = await Cart.findOne({ user: req.user._id });

//   if (!cart) cart = new Cart({ user: req.user._id, items: [] });

//   const index = cart.items.findIndex((i) => i.product.toString() === productId);
//   if (index >= 0) {
//     cart.items[index].quantity += quantity;
//   } else {
//     cart.items.push({ product: productId, quantity });
//   }

//   await cart.save();
//   res.status(200).json(cart);
// };

// export const getCart = async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user._id }).populate(
//     "items.product"
//   );
//   res.json(cart || { items: [] });
// };

// export const removeFromCart = async (req, res) => {
//   const { productId } = req.params;
//   const cart = await Cart.findOne({ user: req.user._id });
//   cart.items = cart.items.filter((i) => i.product.toString() !== productId);
//   await cart.save();
//   res.json(cart);
// };

// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const index = cart.items.findIndex((i) => i.product.toString() === productId);
  if (index >= 0) {
    cart.items[index].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  const populatedCart = await cart.populate("items.product");
  res.status(200).json(populatedCart);
};

// export const getCart = async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user._id }).populate(
//     "items.product"
//   );
//   if (!cart) return res.json({ items: [], totalQty: 0, subtotal: 0 });

//   const totalQty = cart.items.reduce((acc, item) => acc + item.quantity, 0);
//   const subtotal = cart.items.reduce(
//     (acc, item) => acc + item.quantity * item.product.price,
//     0
//   );

//   res.json({ ...cart.toObject(), totalQty, subtotal });
// };

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart) {
    return res.json({ items: [], totalQty: 0, subtotal: 0, total: 0 });
  }

  const totalQty = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  // If you want to include tax, delivery, or discounts:
  const tax = subtotal * 0.13; // example: 13% VAT
  const total = subtotal + tax;

  res.json({
    ...cart.toObject(),
    totalQty,
    subtotal,
    tax,
    total,
  });
};

export const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const index = cart.items.findIndex((i) => i.product.toString() === productId);
  if (index === -1)
    return res.status(404).json({ message: "Product not in cart" });

  if (quantity <= 0) {
    cart.items.splice(index, 1);
  } else {
    cart.items[index].quantity = quantity;
  }

  await cart.save();
  const populatedCart = await cart.populate("items.product");
  res.json(populatedCart);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();

  const populatedCart = await cart.populate("items.product");
  res.json(populatedCart);
};

export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: "Cart cleared" });
};
