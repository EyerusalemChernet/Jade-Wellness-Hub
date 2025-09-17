import express from "express";
import { createBlood, getAllBlood, updateBlood, deleteBlood, addDonor, getDonors } from "../controllers/bloodController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Inventory
router.get("/", getAllBlood);
router.post("/", protectAdmin, createBlood);
router.put("/:id", protectAdmin, updateBlood);
router.delete("/:id", protectAdmin, deleteBlood);

// Donors
router.get("/donors", getDonors);
router.post("/donate", addDonor);

export default router;