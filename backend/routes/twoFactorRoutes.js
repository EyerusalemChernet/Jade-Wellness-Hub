import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  setupTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
  verifyTwoFactorLogin,
  getTwoFactorStatus
} from "../controllers/twoFactorController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Setup 2FA
router.post("/setup", setupTwoFactor);

// Verify 2FA setup
router.post("/verify-setup", verifyTwoFactorSetup);

// Disable 2FA
router.post("/disable", disableTwoFactor);

// Get 2FA status
router.get("/status", getTwoFactorStatus);

// Verify 2FA for login (no auth required)
router.post("/verify-login", verifyTwoFactorLogin);

export default router;



