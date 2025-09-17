import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	medicines: [{ 
		name: String, 
		quantity: Number, 
		price: Number,
		requiresPrescription: { type: Boolean, default: false }
	}],
	totalAmount: { type: Number, required: true },
	paymentMethod: { type: String, enum: ["card", "cod"], default: "card" },
	status: { type: String, enum: ["pending", "pending_cod", "paid", "shipped", "delivered", "cancelled"], default: "pending" },
	prescriptionUrl: { type: String },
	deliveryAddress: { type: String },
	deliveryDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
