import Stripe from "stripe";
import Order from "../models/Order.js";
import Payment from "../models/paymentModel.js";
import env from "../config/env.js";

console.log("STRIPE_SECRET_KEY in paymentController:", env.STRIPE_SECRET_KEY || "Not Loaded");
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15"
});

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this order" });
    }
    if (order.status === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: "etb", // Ethiopian Birr
      metadata: {
        orderId: orderId,
        userId: req.user._id.toString(),
      },
      description: `Payment for JadeWellness order ${orderId}`,
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (error) {
    console.error("Create payment intent error:", {
      message: error.message,
      type: error.type,
      code: error.code,
    });
    next(error);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ message: "Payment intent ID and order ID are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this order" });
    }

    // Retrieve the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === "succeeded") {
      // Create payment record
      const payment = await Payment.create({
        order: orderId,
        user: req.user._id,
        amount: order.totalAmount,
        status: "completed",
        chargeId: paymentIntent.id,
        paymentMethod: paymentIntent.payment_method,
      });

      // Update order status
      order.status = "paid";
      await order.save();

      // Notify patient and pharmacy/admin
      try {
        await Notification.create({ userId: req.user._id, message: `Payment received for order ${orderId}.`, type: "medicine" });
      } catch {}

      console.log("Payment confirmed:", { orderId, paymentIntentId });
      res.json({ success: true, payment });
    } else {
      res.status(400).json({ 
        message: "Payment not completed", 
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error("Confirm payment error:", {
      message: error.message,
      type: error.type,
      code: error.code,
    });
    next(error);
  }
};

export const processPayment = async (req, res, next) => {
  try {
    const { orderId, token } = req.body;
    if (!orderId || !token) {
      return res.status(400).json({ message: "Please provide orderId and token" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to pay for this order" });
    }
    if (order.status === "paid") {
      return res.status(400).json({ message: "Order already paid" });
    }
    const charge = await stripe.charges.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "etb", // Ethiopian Birr
      source: token,
      description: `Payment for order ${orderId}`,
    });
    const payment = await Payment.create({
      order: orderId,
      user: req.user._id,
      amount: order.totalAmount,
      status: "completed",
      chargeId: charge.id,
    });
    order.status = "paid";
    await order.save();
    console.log("Payment processed:", { orderId, chargeId: charge.id });
    res.json({ success: true, payment });
  } catch (error) {
    console.error("Process payment error:", {
      message: error.message,
      type: error.type,
      code: error.code,
    });
    next(error);
  }
};

export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({}).populate("user order", "-password");
    console.log("Fetched all payments:", { count: payments.length });
    res.json(payments);
  } catch (error) {
    console.error("Get payments error:", error);
    next(error);
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    payment.status = status || payment.status;
    await payment.save();
    res.json(payment);
  } catch (error) {
    console.error("Update payment error:", error);
    next(error);
  }
};

export const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    await payment.deleteOne();
    res.json({ message: "Payment deleted" });
  } catch (error) {
    console.error("Delete payment error:", error);
    next(error);
  }
};