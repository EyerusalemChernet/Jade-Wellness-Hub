import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

const ADMIN_NAME = "jerusa";
const ADMIN_EMAIL = "jerusalemroronoa@gmail.com";
const ADMIN_PASSWORD = "Hamle0727";

(async () => {
	try {
		await mongoose.connect(env.MONGO_URI);
		console.log("Connected to DB");

		await User.deleteMany({});
		await Admin.deleteMany({});
		console.log("Cleared Users and Admins collections");

		const adminUser = await User.create({
			name: ADMIN_NAME,
			email: ADMIN_EMAIL,
			password: ADMIN_PASSWORD,
			role: "admin"
		});
		console.log("Created admin user:", { id: adminUser._id, email: ADMIN_EMAIL });

		process.exit(0);
	} catch (err) {
		console.error("Reset error:", err.message);
		process.exit(1);
	}
})();
