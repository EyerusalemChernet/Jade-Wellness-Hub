import User from "../models/User.js";
import { generateSecret, generateQRCode, verifyToken, generateBackupCodes, verifyBackupCode } from "../utils/twoFactorService.js";
import { sendEmail, twoFactorSetupTemplate } from "../utils/emailService.js";

export const setupTwoFactor = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: "Two-factor authentication is already enabled" });
    }

    // Generate secret and QR code
    const { secret, qrCodeUrl } = generateSecret(user.email);
    const qrCodeDataURL = await generateQRCode(qrCodeUrl);
    
    // Generate backup codes
    const backupCodes = generateBackupCodes();

    // Save secret and backup codes to user (but don't enable 2FA yet)
    user.twoFactorSecret = secret;
    user.backupCodes = backupCodes;
    await user.save();

    // Send setup email with backup codes
    try {
      await sendEmail(
        user.email,
        "Two-Factor Authentication Setup - JadeWellness",
        twoFactorSetupTemplate(user.name, backupCodes)
      );
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
    }

    res.json({
      qrCode: qrCodeDataURL,
      secret: secret,
      backupCodes: backupCodes,
      message: "Scan the QR code with your authenticator app and verify with a code to complete setup"
    });
  } catch (error) {
    console.error("Setup 2FA error:", error);
    next(error);
  }
};

export const verifyTwoFactorSetup = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;
    
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: "Two-factor authentication not set up" });
    }

    const isValid = verifyToken(user.twoFactorSecret, token);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: "Two-factor authentication enabled successfully" });
  } catch (error) {
    console.error("Verify 2FA setup error:", error);
    next(error);
  }
};

export const disableTwoFactor = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: "Two-factor authentication is not enabled" });
    }

    // Verify token or backup code
    let isValid = false;
    if (token) {
      if (token.length === 6) {
        // Regular TOTP token
        isValid = verifyToken(user.twoFactorSecret, token);
      } else {
        // Backup code
        isValid = verifyBackupCode(user.backupCodes, token);
        if (isValid) {
          await user.save(); // Save updated backup codes
        }
      }
    }

    if (!isValid) {
      return res.status(400).json({ message: "Invalid token or backup code" });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    user.backupCodes = [];
    await user.save();

    res.json({ message: "Two-factor authentication disabled successfully" });
  } catch (error) {
    console.error("Disable 2FA error:", error);
    next(error);
  }
};

export const verifyTwoFactorLogin = async (req, res, next) => {
  try {
    const { token, email } = req.body;
    
    if (!token || !email) {
      return res.status(400).json({ message: "Token and email are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: "Two-factor authentication not enabled for this user" });
    }

    // Verify token or backup code
    let isValid = false;
    if (token.length === 6) {
      // Regular TOTP token
      isValid = verifyToken(user.twoFactorSecret, token);
    } else {
      // Backup code
      isValid = verifyBackupCode(user.backupCodes, token);
      if (isValid) {
        await user.save(); // Save updated backup codes
      }
    }

    if (!isValid) {
      return res.status(400).json({ message: "Invalid token or backup code" });
    }

    res.json({ message: "Two-factor authentication verified successfully" });
  } catch (error) {
    console.error("Verify 2FA login error:", error);
    next(error);
  }
};

export const getTwoFactorStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("twoFactorEnabled backupCodes");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      twoFactorEnabled: user.twoFactorEnabled,
      backupCodesCount: user.backupCodes ? user.backupCodes.length : 0
    });
  } catch (error) {
    console.error("Get 2FA status error:", error);
    next(error);
  }
};



