import BloodRequest from "../models/bloodRequestModel.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { sendEmail } from "../utils/emailService.js";

export const createBloodRequest = async (req, res, next) => {
  try {
    const { patientName, bloodType, hospital, urgency } = req.body;
    if (!patientName || !bloodType || !hospital || !urgency) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    const bloodRequest = await BloodRequest.create({
      user: req.user._id,
      patientName,
      bloodType,
      hospital,
      urgency,
      status: "pending",
    });

    // Notify all admins about new blood request
    try {
      const admins = await Admin.find({});
      for (const admin of admins) {
        await sendEmail(
          admin.email,
          "New Blood Request Requires Review",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Blood Request Requires Review</h2>
            <p>A new blood request has been submitted. Please log in to the admin dashboard to check availability and accept/reject it.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li><strong>Patient:</strong> ${patientName}</li>
              <li><strong>Blood Type:</strong> ${bloodType}</li>
              <li><strong>Hospital:</strong> ${hospital}</li>
              <li><strong>Urgency:</strong> ${urgency}</li>
            </ul>
            <p style="margin-top: 20px;">Best regards,<br/>The JadeWellness Team</p>
          </div>
          `
        );
      }
    } catch (emailError) {
      console.error("Blood request notification email failed:", emailError.message);
    }

    res.status(201).json(bloodRequest);
  } catch (error) {
    console.error("Create blood request error:", error);
    next(error);
  }
};

export const getBloodRequests = async (req, res, next) => {
  try {
    const bloodRequests = await BloodRequest.find({ user: req.user._id });
    res.json(bloodRequests);
  } catch (error) {
    console.error("Get blood requests error:", error);
    next(error);
  }
};

export const updateBloodRequest = async (req, res, next) => {
  try {
    const { patientName, bloodType, hospital, urgency, status } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id).populate("user", "name email");
    if (!bloodRequest) {
      return res.status(404).json({ message: "Blood request not found" });
    }
    if (bloodRequest.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    bloodRequest.patientName = patientName || bloodRequest.patientName;
    bloodRequest.bloodType = bloodType || bloodRequest.bloodType;
    bloodRequest.hospital = hospital || bloodRequest.hospital;
    bloodRequest.urgency = urgency || bloodRequest.urgency;
    bloodRequest.status = status || bloodRequest.status;
    const updatedBloodRequest = await bloodRequest.save();

    // Send notification for acceptance
    if (status === "accepted") {
      await Notification.create({
        userId: bloodRequest.user._id,
        message: `Your blood request for ${bloodRequest.patientName} (${bloodRequest.bloodType}) has been accepted.`,
        type: "blood_request",
      });
    }

    res.json(updatedBloodRequest);
  } catch (error) {
    console.error("Update blood request error:", error);
    next(error);
  }
};

export const deleteBloodRequest = async (req, res, next) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({ message: "Blood request not found" });
    }
    if (bloodRequest.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    await bloodRequest.deleteOne();
    res.json({ message: "Blood request deleted" });
  } catch (error) {
    console.error("Delete blood request error:", error);
    next(error);
  }
};