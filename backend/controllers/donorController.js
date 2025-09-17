import Donor from "../models/Donor.js";
import { sendEmail, donationConfirmationTemplate } from "../utils/emailService.js";

export const createDonor = async (req, res, next) => {
  try {
    const { name, bloodType, contact } = req.body;
    const donor = await Donor.create({ name, bloodType, contact });
    
    // Send confirmation email to donor
    try {
      await sendEmail(
        contact,
        "Blood Donation Registration Confirmation",
        donationConfirmationTemplate(name, bloodType)
      );
    } catch (emailError) {
      console.error("Donor confirmation email failed:", emailError.message);
    }
    
    res.status(201).json(donor);
  } catch (error) { next(error); }
};

export const getAllDonors = async (req, res, next) => {
  try {
    const donors = await Donor.find({});
    res.json(donors);
  } catch (error) { next(error); }
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