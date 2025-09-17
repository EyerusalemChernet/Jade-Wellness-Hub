import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      
      // Try to find user in all collections
      req.user = await User.findById(decoded.id).select("-password");
      if (req.user) {
        req.user.role = "user";
      } else {
        req.user = await Admin.findById(decoded.id).select("-password");
        if (req.user) {
          req.user.role = "admin";
        } else {
          req.user = await Doctor.findById(decoded.id).select("-password");
          if (req.user) {
            req.user.role = "doctor";
          }
        }
      }
      
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      console.error("Protect middleware error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      req.user = await Admin.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, admin not found" });
      }
      req.user.role = "admin"; // Ensure role is set
      next();
    } catch (error) {
      console.error("ProtectAdmin middleware error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as admin" });
  }
};