import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodType: { type: String, required: true },
  hospital: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "fulfilled"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("BloodRequest", bloodRequestSchema);