import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["new_appointment", "appointment_accepted", "appointment_rejected", "system_alert", "medicine", "blood_request"], 
    required: true 
  },
  read: { type: Boolean, default: false },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);