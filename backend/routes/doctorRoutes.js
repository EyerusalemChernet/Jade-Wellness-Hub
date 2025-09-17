import express from "express";
import { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor } from "../controllers/doctorController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);
router.post("/", protectAdmin, createDoctor);
router.put("/:id", protectAdmin, updateDoctor);
router.delete("/:id", protectAdmin, deleteDoctor);

export default router;