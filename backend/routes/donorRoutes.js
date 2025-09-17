import express from "express";
import { addDonor, getDonors, updateDonor, deleteDonor } from "../controllers/bloodController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDonors);
router.post("/", protect, admin, addDonor);
router.put("/:id", protect, admin, updateDonor);
router.delete("/:id", protect, admin, deleteDonor);

export default router;