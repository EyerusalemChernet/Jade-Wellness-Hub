import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  experience: { type: Number, required: true },
  qualifications: { type: String, required: true },
  qualificationsFile: { type: String }, // For file upload
  available: { type: Boolean, default: true },
  password: { type: String }, // For doctor login
  role: { type: String, default: "doctor" }
}, { timestamps: true });

// Hash password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  const looksHashed = typeof this.password === "string" && this.password.startsWith("$2");
  if (looksHashed) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  const isMatch = enteredPassword === this.password;
  if (isMatch) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(enteredPassword, salt);
    try {
      await this.save();
    } catch {}
  }
  return isMatch;
};

export default mongoose.model("Doctor", doctorSchema);
