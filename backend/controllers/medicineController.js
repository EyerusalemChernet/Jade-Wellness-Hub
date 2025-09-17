import Medicine from "../models/Medicine.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createMedicine = async (req, res, next) => {
  try {
    const { name, price, stock, description, imageUrl } = req.body;
    if (!name || !price || !stock) {
      return res.status(400).json({ message: "Please provide name, price, and stock" });
    }
    const medicine = await Medicine.create({ name, price, stock, description, imageUrl });

    // Notify subscribed users
    const subscribedUsers = await User.find({ isSubscribed: true });
    const notifications = subscribedUsers.map(user => ({
      userId: user._id,
      message: `New medicine added: ${name}. Price: $${price}.`,
      type: "medicine",
    }));
    await Notification.insertMany(notifications);

    res.status(201).json(medicine);
  } catch (error) {
    console.error("Create medicine error:", error);
    next(error);
  }
};

export const getMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    console.error("Get medicines error:", error);
    next(error);
  }
};

export const updateMedicine = async (req, res, next) => {
  try {
    const { name, price, stock, description } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    medicine.name = name || medicine.name;
    medicine.price = price || medicine.price;
    medicine.stock = stock || medicine.stock;
    medicine.description = description || medicine.description;
    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } catch (error) {
    console.error("Update medicine error:", error);
    next(error);
  }
};

export const deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    await medicine.deleteOne();
    res.json({ message: "Medicine deleted" });
  } catch (error) {
    console.error("Delete medicine error:", error);
    next(error);
  }
};