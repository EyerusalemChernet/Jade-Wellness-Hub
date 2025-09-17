import express from "express";
import { createAppointment, getAppointments, updateAppointment, deleteAppointment, getDoctorAppointments, updateAppointmentStatus, addDoctorNote, createPrescription } from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAppointments);
router.post("/", protect, createAppointment);
router.put("/:id", protect, updateAppointment);
router.delete("/:id", protect, deleteAppointment);
// Doctor-specific
router.get("/doctor", protect, getDoctorAppointments);
router.patch("/:id/status", protect, updateAppointmentStatus);
router.post("/:id/notes", protect, addDoctorNote);
router.post("/:id/prescriptions", protect, createPrescription);

export default router;