import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Customer from "../models/Customer.js";

// 🔥 Recalculate customer's total credit balance
const recalcCustomerCredit = async (customerId) => {
  const orders = await Order.find({ customer: customerId });

  let balance = 0;
  for (const o of orders) {
    const remaining = o.total - o.amountPaid;
    if (remaining > 0) balance += remaining;
  }

  await Customer.findByIdAndUpdate(customerId, { creditBalance: balance });
};

// 🔥 Update payment (cash, partial, credit)
export const updatePayment = async (req, res) => {
  try {
    const { amountPaid, paymentMethod } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate("customer");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const customer = order.customer;

    // ---------- CREDIT PAYMENT ----------
    if (paymentMethod === "credit") {
      const remaining = order.total - order.amountPaid;

      await Payment.create({
        order: order._id,
        customer: customer?._id,
        amount: remaining, // <---- FIXED
        method: "credit",
        note: note || "",
        receivedBy: req.user._id, // <---- Audit: who received this
      });

      order.paymentMethod = "credit";
      order.paymentStatus = "pending";
      await order.save();

      if (customer) await recalcCustomerCredit(customer._id);

      return res.json({ message: "Order added to credit", order });
    }

    // ---------- CASH / PARTIAL PAYMENT ----------
    if (!amountPaid || amountPaid <= 0) {
      return res.status(400).json({ message: "Valid amount required" });
    }

    const remaining = order.total - order.amountPaid;
    const payAmount = Math.min(amountPaid, remaining);

    order.amountPaid += payAmount;
    order.paymentMethod = paymentMethod;
    order.paymentStatus = order.amountPaid >= order.total ? "paid" : "partial";

    await order.save();

    await Payment.create({
      order: order._id,
      customer: customer?._id,
      amount: payAmount,
      method: paymentMethod,
      note: note || "",
      receivedBy: req.user._id, // <---- Audit: who received this
    });

    if (customer) await recalcCustomerCredit(customer._id);

    return res.json({ message: "Payment updated", order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🔥 Get payment history for an order
export const getPaymentHistory = async (req, res) => {
  try {
    const history = await Payment.find({ order: req.params.orderId }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
