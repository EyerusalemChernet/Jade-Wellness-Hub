import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
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

export default mongoose.model("Admin", adminSchema);