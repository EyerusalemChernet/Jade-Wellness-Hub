import User from "../models/User.js";
import { sendEmail, welcomeEmailTemplate } from "../utils/emailService.js";


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase().trim();
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: "Profile updated successfully",
      user: userObj
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("loginHistory");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return last 20 login attempts
    const recentHistory = user.loginHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);

    res.json(recentHistory);
  } catch (error) {
    console.error("Get login history error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const exportUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -twoFactorSecret");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get related data
    const userData = {
      profile: user.toObject(),
      exportDate: new Date().toISOString(),
      dataTypes: ["profile", "login_history"]
    };

    res.json(userData);
  } catch (error) {
    console.error("Export data error:", error);
    res.status(500).json({ error: error.message });
  }
};