import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Notification from "../models/Notification.js";
import { sendEmail, appointmentConfirmationTemplate } from "../utils/emailService.js";

export const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time, note } = req.body;
    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: "Please provide doctorId, date, and time" });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      date,
      time,
      status: "pending",
      reason: note || "",
    });

    // Create notifications for appointment booking
    try {
      // Notify all admins
      const admins = await Admin.find({});
      for (const admin of admins) {
        await Notification.create({
          userId: admin._id,
          message: `New appointment request from ${req.user.name} for Dr. ${doctor.name} on ${new Date(date).toLocaleDateString()}`,
          type: "new_appointment",
          relatedEntityId: appointment._id
        });
      }

      // Find the doctor's user account and notify them
      const doctorUser = await User.findOne({ email: doctor.email });
      if (doctorUser) {
        await Notification.create({
          userId: doctorUser._id,
          message: `You have a new appointment request from ${req.user.name} for ${new Date(date).toLocaleDateString()}`,
          type: "new_appointment",
          relatedEntityId: appointment._id
        });
      }
    } catch (notificationError) {
      console.error("Notification creation failed:", notificationError);
    }

    // Send confirmation email (optional - don't fail if email service is down)
    try {
      await sendEmail(
        req.user.email,
        "Appointment Confirmation",
        appointmentConfirmationTemplate(req.user.name, doctor.name, date, time)
      );
    } catch (emailError) {
      console.log("Email sending failed, but appointment was created:", emailError.message);
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Create appointment error:", error);
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).populate("doctor", "name specialty");
    res.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    next(error);
  }
};

export const getDoctorAppointments = async (req, res, next) => {
  try {
    // For doctors, req.user is Admin model when admin; ensure doctor role
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate("user", "name email")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    console.error("Get doctor appointments error:", error);
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // approved | rejected | completed
    if (!status) return res.status(400).json({ message: "Status required" });
    const appt = await Appointment.findById(req.params.id).populate("doctor", "name");
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (req.user.role !== "doctor" || appt.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    appt.status = status;
    await appt.save();
    
    // Notify patient on status change
    try {
      let message = "";
      let notificationType = "";
      
      if (status === "approved") {
        message = `Your appointment with Dr. ${appt.doctor.name} on ${new Date(appt.date).toLocaleDateString()} has been confirmed!`;
        notificationType = "appointment_accepted";
      } else if (status === "rejected") {
        message = `Your appointment request with Dr. ${appt.doctor.name} on ${new Date(appt.date).toLocaleDateString()} was not accepted. Please try another time.`;
        notificationType = "appointment_rejected";
      } else {
        message = `Your appointment on ${new Date(appt.date).toLocaleDateString()} was ${status}.`;
        notificationType = "appointment_accepted";
      }
      
      await Notification.create({
        userId: appt.user,
        message,
        type: notificationType,
        relatedEntityId: appt._id
      });
    } catch (notificationError) {
      console.error("Notification creation failed:", notificationError);
    }
    
    res.json(appt);
  } catch (error) {
    console.error("Update appointment status error:", error);
    next(error);
  }
};

export const addDoctorNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (req.user.role !== "doctor" || appt.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    appt.notes.push({ author: req.user._id, content });
    await appt.save();
    res.json(appt);
  } catch (error) {
    console.error("Add doctor note error:", error);
    next(error);
  }
};

export const createPrescription = async (req, res, next) => {
  try {
    const { medicine, dosage, instructions } = req.body;
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    if (req.user.role !== "doctor" || appt.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    appt.prescriptions.push({ medicine, dosage, instructions, status: "sent" });
    await appt.save();
    res.json(appt);
  } catch (error) {
    console.error("Create prescription error:", error);
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate("user", "name email");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    appointment.status = status || appointment.status;
    const updatedAppointment = await appointment.save();

    // Send notification for approval/rejection
    if (status && ["approved", "rejected"].includes(status)) {
      await Notification.create({
        userId: appointment.user._id,
        message: `Your appointment with Dr. ${appointment.doctor.name} on ${appointment.date} has been ${status}.`,
        type: "appointment",
      });
    }

    res.json(updatedAppointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    if (appointment.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    await appointment.deleteOne();
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Delete appointment error:", error);
    next(error);
  }
};