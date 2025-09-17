import express from "express";
import { processPayment, getAllPayments, updatePayment, deletePayment, createPaymentIntent, confirmPayment } from "../controllers/paymentController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Modern Stripe Payment Intents API
router.post("/create-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);

// Legacy payment processing (kept for backward compatibility)
router.post("/", protect, processPayment);

// Admin routes
router.get("/", protectAdmin, getAllPayments);
router.put("/:id", protectAdmin, updatePayment);
router.delete("/:id", protectAdmin, deletePayment);

export default router;