import Blood from "../models/Blood.js";
import Donor from "../models/Donor.js";
import { sendEmail, donationConfirmationTemplate } from "../utils/emailService.js";

export const getAllBlood = async (req, res, next) => {
	try {
		const bloods = await Blood.find({});
		res.json(bloods);
	} catch (error) {
		console.error("Get blood error:", error);
		next(error);
	}
};

export const createBlood = async (req, res, next) => {
	try {
		const { bloodType, quantity } = req.body;
		if (!bloodType || !quantity) {
			return res.status(400).json({ message: "Blood type and quantity are required" });
		}
		const blood = await Blood.create({ bloodType, quantity });
		res.status(201).json(blood);
	} catch (error) {
		console.error("Create blood error:", error);
		next(error);
	}
};

export const updateBlood = async (req, res, next) => {
	try {
		const { bloodType, quantity } = req.body;
		const blood = await Blood.findById(req.params.id);
		if (!blood) {
			return res.status(404).json({ message: "Blood record not found" });
		}
		blood.bloodType = bloodType || blood.bloodType;
		blood.quantity = quantity || blood.quantity;
		await blood.save();
		res.json(blood);
	} catch (error) {
		console.error("Update blood error:", error);
		next(error);
	}
};

export const deleteBlood = async (req, res, next) => {
	try {
		const blood = await Blood.findById(req.params.id);
		if (!blood) {
			return res.status(404).json({ message: "Blood record not found" });
		}
		await blood.deleteOne();
		res.json({ message: "Blood record deleted" });
	} catch (error) {
		console.error("Delete blood error:", error);
		next(error);
	}
};

export const addDonor = async (req, res, next) => {
	try {
		const { donorName, name, bloodType, phone, email } = req.body;
		const resolvedName = name || donorName;
		if (!resolvedName || !bloodType || !(phone || email)) {
			return res.status(400).json({ message: "Name, blood type, and contact (phone or email) are required" });
		}
		const donor = await Donor.create({ name: resolvedName, bloodType, contact: email || phone });

		// Fire-and-forget email (no failure on email error)
		if (email) {
			try {
				await sendEmail(email, "Blood Donation Received", donationConfirmationTemplate(resolvedName, bloodType));
			} catch (emailErr) {
				console.log("Donation email failed:", emailErr.message);
			}
		}

		res.status(201).json(donor);
	} catch (error) {
		console.error("Add donor error:", error);
		next(error);
	}
};

export const getDonors = async (req, res, next) => {
	try {
		const donors = await Donor.find({});
		res.json(donors);
	} catch (error) {
		console.error("Get donors error:", error);
		next(error);
	}
};

export const updateDonor = async (req, res, next) => {
	try {
		const { name, bloodType, contact } = req.body;
		const donor = await Donor.findById(req.params.id);
		if (!donor) {
			return res.status(404).json({ message: "Donor not found" });
		}
		donor.name = name || donor.name;
		donor.bloodType = bloodType || donor.bloodType;
		donor.contact = contact || donor.contact;
		await donor.save();
		res.json(donor);
	} catch (error) {
		console.error("Update donor error:", error);
		next(error);
	}
};

export const deleteDonor = async (req, res, next) => {
	try {
		const donor = await Donor.findById(req.params.id);
		if (!donor) {
			return res.status(404).json({ message: "Donor not found" });
		}
		await donor.deleteOne();
		res.json({ message: "Donor deleted" });
	} catch (error) {
		console.error("Delete donor error:", error);
		next(error);
	}
};