import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";

export const getAllDoctors = async (req, res, next) => {
	try {
		const { q } = req.query;
		let filter = {};
		if (q && q.trim()) {
			const regex = new RegExp(q.trim(), "i");
			filter = { $or: [{ name: regex }, { specialty: regex }] };
		}
		const doctors = await Doctor.find(filter);
		console.log("Fetched doctors:", { count: doctors.length, hasQuery: Boolean(q) });
		res.json(doctors);
	} catch (error) {
		console.error("Get all doctors error:", error);
		next(error);
	}
};

export const getDoctorById = async (req, res, next) => {
	try {
		const doctor = await Doctor.findById(req.params.id);
		if (!doctor) return res.status(404).json({ message: "Doctor not found" });
		res.json(doctor);
	} catch (error) {
		console.error("Get doctor by id error:", error);
		next(error);
	}
};

export const createDoctor = async (req, res, next) => {
	try {
		const { name, specialty, email, phone, experience, qualifications, qualificationsFile } = req.body;
		
		// Generate a temporary password for the doctor
		const tempPassword = Math.random().toString(36).slice(-8);
		
		const doctor = await Doctor.create({
			name,
			specialty,
			email,
			phone,
			experience,
			qualifications,
			qualificationsFile,
			password: tempPassword // The model will hash it automatically
		});
		
		// Send email to doctor with login credentials
		try {
			const { sendEmail, doctorWelcomeTemplate } = await import("../utils/emailService.js");
			await sendEmail(email, "Welcome to JadeWellness - Doctor Account Created", doctorWelcomeTemplate(name, email, tempPassword));
		} catch (emailError) {
			console.error("Email sending failed:", emailError.message);
		}
		
		res.status(201).json({
			message: "Doctor added successfully",
			doctor: {
				_id: doctor._id,
				name: doctor.name,
				specialty: doctor.specialty,
				email: doctor.email
			},
			tempPassword // Include temp password in response for admin reference
		});
	} catch (error) {
		console.error("Create doctor error:", error);
		next(error);
	}
};

export const updateDoctor = async (req, res, next) => {
	try {
		const doctor = await Doctor.findById(req.params.id);
		if (!doctor) return res.status(404).json({ message: "Doctor not found" });
		Object.assign(doctor, req.body);
		await doctor.save();
		res.json(doctor);
	} catch (error) {
		console.error("Update doctor error:", error);
		next(error);
	}
};

export const deleteDoctor = async (req, res, next) => {
	try {
		const doctor = await Doctor.findById(req.params.id);
		if (!doctor) return res.status(404).json({ message: "Doctor not found" });
		await doctor.deleteOne();
		res.json({ message: "Doctor deleted" });
	} catch (error) {
		console.error("Delete doctor error:", error);
		next(error);
	}
};