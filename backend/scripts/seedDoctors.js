import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/jadewellness");
    console.log("Connected to MongoDB");

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log("Cleared existing doctors");

    // Create sample doctors
    const sampleDoctors = [
      {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        email: "sarah.johnson@jadewellness.com",
        phone: "+1-555-0101",
        experience: 10,
        qualifications: "MD, PhD Cardiology, Board Certified",
        password: await bcrypt.hash("doctor123", 10)
      },
      {
        name: "Dr. Michael Chen",
        specialty: "Dermatology",
        email: "michael.chen@jadewellness.com",
        phone: "+1-555-0102",
        experience: 8,
        qualifications: "MD, Board Certified Dermatologist",
        password: await bcrypt.hash("doctor123", 10)
      },
      {
        name: "Dr. Emily Rodriguez",
        specialty: "Pediatrics",
        email: "emily.rodriguez@jadewellness.com",
        phone: "+1-555-0103",
        experience: 12,
        qualifications: "MD, Pediatric Specialist, Board Certified",
        password: await bcrypt.hash("doctor123", 10)
      },
      {
        name: "Dr. David Kim",
        specialty: "Neurology",
        email: "david.kim@jadewellness.com",
        phone: "+1-555-0104",
        experience: 15,
        qualifications: "MD, PhD Neurology, Fellowship Trained",
        password: await bcrypt.hash("doctor123", 10)
      },
      {
        name: "Dr. Lisa Thompson",
        specialty: "Orthopedics",
        email: "lisa.thompson@jadewellness.com",
        phone: "+1-555-0105",
        experience: 7,
        qualifications: "MD, Orthopedic Surgery, Sports Medicine",
        password: await bcrypt.hash("doctor123", 10)
      }
    ];

    await Doctor.insertMany(sampleDoctors);
    console.log("Sample doctors added successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding doctors:", error);
    process.exit(1);
  }
};

seedDoctors();

