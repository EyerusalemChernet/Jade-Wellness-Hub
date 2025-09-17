import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser } from "../controllers/authController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/:id", protect, protectAdmin, deleteUser);

export default router;