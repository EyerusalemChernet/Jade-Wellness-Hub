import express from "express";
import { createOrder, getAllOrders, updateOrder, deleteOrder } from "../controllers/orderController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/", protectAdmin, getAllOrders);
router.post("/", protect, createOrder);
router.put("/:id", protectAdmin, updateOrder);
router.delete("/:id", protectAdmin, deleteOrder);

// User's orders
router.get("/mine", protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Single order by id (only owner or admin)
router.get("/:id", protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;