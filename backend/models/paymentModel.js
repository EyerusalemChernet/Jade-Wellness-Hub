import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "refunded"], default: "pending" },
  chargeId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);