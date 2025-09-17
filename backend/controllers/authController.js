import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail, welcomeEmailTemplate, passwordResetTemplate } from "../utils/emailService.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, birthdate, gender, medicalCondition } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ 
      name: name.trim(), 
      email: normalizedEmail, 
      password,
      ...(birthdate ? { birthdate: new Date(birthdate) } : {}),
      ...(gender ? { gender } : {}),
      ...(medicalCondition ? { medicalCondition } : {})
    });
    
    // Send welcome email (non-blocking)
    try {
      await sendEmail(normalizedEmail, "Welcome to JadeWellness", welcomeEmailTemplate(name.trim()));
    } catch (emailError) {
      console.error("Welcome email failed:", emailError.message);
    }
    
    // Generate token with default user role (patient)
    const payloadUser = { _id: user._id, role: 'user', name: user.name, email: user.email };
    const token = generateToken(payloadUser);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      user: userObj,
      token
    });
  } catch (error) {
    console.error("Register user error:", error);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Always use lowercase for normalization, but match case-insensitively in DB
    const normalizedEmail = email.toLowerCase().trim();
    const emailCI = new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

    let user = null;
    let userType = "user";

    // Try all user types to find the correct one (case-insensitive match)
    user = await User.findOne({ email: emailCI });
    if (user) {
      userType = "user";
    } else {
      user = await Admin.findOne({ email: emailCI });
      if (user) {
        userType = "admin";
      } else {
        user = await Doctor.findOne({ email: emailCI });
        if (user) {
          userType = "doctor";
        }
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ 
      user: { ...userObj, role: userType }, 
      token 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Get user profile error:", error);
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name.trim();
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

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Delete user error:", error);
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = generateToken(user, "1h"); // Short-lived token
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    
    try {
      await sendEmail(email, "Password Reset Request", passwordResetTemplate(user.name, resetLink));
    } catch {}
    
    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Password reset error:", error);
    next(error);
  }
};