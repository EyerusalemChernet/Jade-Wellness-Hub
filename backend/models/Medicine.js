import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String },
	price: { type: Number, required: true },
	stock: { type: Number, required: true },
	imageUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("Medicine", medicineSchema);