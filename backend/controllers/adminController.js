import Admin from "../models/Admin.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js"; // Fixed import
import { sendEmail, welcomeEmailTemplate } from "../utils/emailService.js";

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const admin = await Admin.create({ name, email, password });
    
    // Send welcome email
    await sendEmail(email, "Welcome to JadeWellness Admin", welcomeEmailTemplate(name));
    
    console.log("Admin login attempt:", { email, adminExists: true, hasMatchPassword: true });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error("Register admin error:", error);
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      console.log("Admin login attempt:", { email, adminExists: true, hasMatchPassword: true });
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      console.log("Admin login attempt:", { email, adminExists: !!admin, hasMatchPassword: false });
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login admin error:", error);
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    next(error);
  }
};

export const updateAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (admin) {
      admin.name = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;
      if (req.body.password) {
        admin.password = req.body.password;
      }
      const updatedAdmin = await admin.save();
      res.json({
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        token: generateToken(updatedAdmin._id),
      });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    console.error("Update admin profile error:", error);
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
      await admin.deleteOne();
      res.json({ message: "Admin deleted" });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    console.error("Delete admin error:", error);
    next(error);
  }
};