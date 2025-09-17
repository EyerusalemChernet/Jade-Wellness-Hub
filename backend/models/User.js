import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  birthdate: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"], default: undefined },
  medicalCondition: { type: String },
  twoFactorSecret: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  backupCodes: [{ type: String }],
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    location: String,
    success: { type: Boolean, default: true }
  }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  // If stored password looks like a bcrypt hash, compare normally
  const looksHashed = typeof this.password === "string" && this.password.startsWith("$2");
  if (looksHashed) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  // Fallback: legacy/plaintext password stored; compare directly and then rehash
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

export default mongoose.model("User", userSchema);