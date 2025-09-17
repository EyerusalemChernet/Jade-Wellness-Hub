import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" },
  notes: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  prescriptions: [{
    medicine: { type: String, required: true },
    dosage: { type: String },
    instructions: { type: String },
    status: { type: String, enum: ["sent", "approved"], default: "sent" },
    createdAt: { type: Date, default: Date.now },
    approvedAt: { type: Date }
  }]
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
