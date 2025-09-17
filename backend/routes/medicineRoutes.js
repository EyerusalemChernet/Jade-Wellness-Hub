import express from "express";
import { createMedicine, getMedicines, updateMedicine, deleteMedicine } from "../controllers/medicineController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getMedicines);
router.post("/", protect, admin, createMedicine);
router.put("/:id", protect, admin, updateMedicine);
router.delete("/:id", protect, admin, deleteMedicine);

export default router;