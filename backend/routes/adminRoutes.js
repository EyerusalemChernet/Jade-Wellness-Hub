import express from "express";
import { registerAdmin, loginAdmin, getUsers, updateAdminProfile, deleteAdmin } from "../controllers/adminController.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import env from "../config/env.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("Admin routes registered");
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", protectAdmin, getUsers);
router.put("/profile", protectAdmin, updateAdminProfile);
router.delete("/:id", protectAdmin, deleteAdmin);

// Maintenance: wipe all users and optionally reseed admin/doctor
router.post("/maintenance/wipe-and-seed", async (req, res) => {
  try {
    const { resetKey } = req.body;
    // In production require correct reset key; in development allow without key
    const requireKey = env.__IS_PROD;
    if (requireKey) {
      if (!resetKey || resetKey !== (process.env.RESET_KEY || env.RESET_KEY)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Doctor.deleteMany({})
    ]);

    const created = {};
    // Seed requested admin
    created.admin = await Admin.create({
      name: "jerusa",
      email: "jerusalemroronoa@gmail.com",
      password: "Hamle0727"
    });
    // Seed requested doctor (with required fields)
    created.doctor = await Doctor.create({
      name: "Dr Etsub Zewdu",
      email: "jerrykpoper2@gmail.com",
      password: "Hamle0727",
      phone: "N/A",
      specialty: "General Medicine",
      experience: 5,
      qualifications: "MBBS"
    });

    res.json({ message: "All users wiped and default accounts created", created });
  } catch (err) {
    console.error("wipe-and-seed error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;