import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodType: { type: String, required: true },
  contact: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Donor", donorSchema);
