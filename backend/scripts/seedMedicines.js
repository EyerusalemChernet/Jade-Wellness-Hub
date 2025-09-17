import mongoose from "mongoose";
import env from "../config/env.js";
import Medicine from "../models/Medicine.js";

const medicines = [
	{ name: "Paracetamol 500mg", description: "Pain reliever and fever reducer.", price: 4.99, stock: 120, imageUrl: "/src/assets/medicine/Paracetamol.jpg" },
	{ name: "Amoxicillin 250mg", description: "Antibiotic for bacterial infections.", price: 12.5, stock: 80, imageUrl: "/src/assets/medicine/Amoxicillin.jpg" },
	{ name: "Omeprazole 20mg", description: "Reduces stomach acid (GERD).", price: 9.75, stock: 60, imageUrl: "/src/assets/medicine/Omeprazole.jpg" },
	{ name: "Cetirizine 10mg", description: "Allergy relief antihistamine.", price: 5.5, stock: 150, imageUrl: "/src/assets/medicine/Cetirizine.jpg" },
	{ name: "Metformin 500mg", description: "Type 2 diabetes management.", price: 7.25, stock: 100, imageUrl: "/src/assets/medicine/Metformin.jpg" },
];

(async () => {
	try {
		await mongoose.connect(env.MONGO_URI);
		await Medicine.deleteMany({});
		await Medicine.insertMany(medicines);
		console.log("Seeded medicines:", medicines.length);
		process.exit(0);
	} catch (err) {
		console.error("Seed error:", err.message);
		process.exit(1);
	}
})();
