import mongoose from "mongoose";

const bloodSchema = new mongoose.Schema({
  bloodType: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Blood", bloodSchema);
