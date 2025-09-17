import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import env from "./config/env.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import bloodRoutes from "./routes/bloodRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bloodRequestRoutes from "./routes/requestBloodRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import twoFactorRoutes from "./routes/twoFactorRoutes.js";
import { verifyEmailTransport } from "./utils/emailService.js";
import { createIndexes } from "./utils/dbOptimization.js";
import Admin from "./models/Admin.js";
import Doctor from "./models/Doctor.js";

const app = express();

// Enhanced CORS configuration for development
const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps, curl, postman)
		if (!origin) return callback(null, true);
		
		const allowedOrigins = [
			"http://localhost:3000",
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"http://localhost:5174",
			"https://jade-wellness-frontend.vercel.app", // Production frontend URL
			env.FRONTEND_ORIGIN || ""
		].filter(Boolean);
		
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			console.log("CORS blocked for origin:", origin);
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static hosting for uploaded files
import path from "path";
import fs from "fs";
const uploadsPath = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
	fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

// Logging middleware
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

console.log("Registering routes...");
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/blood-bank", bloodRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/2fa", twoFactorRoutes);
console.log("All routes registered");

// Health check endpoint
app.get("/api/health", (req, res) => {
	const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
	
	res.status(200).json({ 
		status: "OK", 
		message: "Server is running",
		database: dbStatus,
		timestamp: new Date().toISOString()
	});
});

app.get("/api/health/email", async (req, res) => {
	try {
		await verifyEmailTransport();
		res.json({ status: "OK", message: "SMTP transport verified" });
	} catch (err) {
		res.status(500).json({ status: "ERROR", message: err.message });
	}
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
	res.status(404).json({ 
		message: "API endpoint not found",
		path: req.originalUrl 
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error("Error:", err);
	
	// Mongoose validation error
	if (err.name === "ValidationError") {
		return res.status(400).json({
			message: "Validation Error",
			errors: Object.values(err.errors).map(e => e.message)
		});
	}
	
	// Mongoose duplicate key error
	if (err.code === 11000) {
		return res.status(400).json({
			message: "Duplicate field value entered",
			field: Object.keys(err.keyValue)[0]
		});
	}
	
	// JWT errors
	if (err.name === "JsonWebTokenError") {
		return res.status(401).json({ message: "Invalid token" });
	}
	
	if (err.name === "TokenExpiredError") {
		return res.status(401).json({ message: "Token expired" });
	}
	
	// CORS error
	if (err.message === "Not allowed by CORS") {
		return res.status(403).json({ message: "CORS policy blocked this request" });
	}
	
	// Default error
	res.status(err.statusCode || 500).json({
		message: err.message || "Internal Server Error",
		...(process.env.NODE_ENV === "development" && { stack: err.stack })
	});
});

// MongoDB connection with improved error handling and retry logic
const connectWithRetry = async () => {
	if (!env.MONGO_URI) {
		console.warn("[db] MONGO_URI not set. Skipping DB connection in development.");
		return;
	}
	try {
		await mongoose.connect(env.MONGO_URI, {
			serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
			connectTimeoutMS: 30000, // Connection timeout
			maxPoolSize: 10, // Maintain up to 10 socket connections
			serverApi: {
				version: '1',
				strict: false,
				deprecationErrors: true,
			}
		});
		console.log("MongoDB connected successfully");
	} catch (err) {
		console.error("MongoDB connection error:", err.message);
		console.log("Retrying connection in 5 seconds...");
		setTimeout(connectWithRetry, 5000);
	}
};

// Handle MongoDB connection events
mongoose.connection.on("connected", async () => {
	console.log("MongoDB connected:", env.MONGO_URI.split("@")[1]);
	
	// Create database indexes for better performance
	await createIndexes();
	
	// Verify email transport after DB connection
	verifyEmailTransport()
		.then(() => console.log("Email service verified"))
		.catch(err => console.error("Email service verification failed:", err.message));

	// Seed default critical accounts (idempotent)
	try {
		await seedDefaultAccounts();
		console.log("Default accounts ensured");
	} catch (seedErr) {
		console.error("Seeding default accounts failed:", seedErr.message);
	}
});

mongoose.connection.on("error", (err) => {
	console.error("MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
	console.log("MongoDB disconnected");
});

// Start server even if MongoDB is not available
const PORT = env.PORT || 5002;

// Initial connection attempt
connectWithRetry();

const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log(`Health check available at: http://localhost:${PORT}/api/health`);
	console.log("Note: Server is running but MongoDB may not be connected yet");
});

// Graceful shutdown
process.on("SIGINT", async () => {
	console.log("Shutting down gracefully...");
	
	server.close(() => {
		console.log("HTTP server closed");
	});
	
	if (mongoose.connection.readyState === 1) {
		await mongoose.connection.close();
		console.log("MongoDB connection closed");
	}
	
	process.exit(0);
});

export default app;

async function seedDefaultAccounts() {
	const seedEntries = [
		{
			type: "admin",
			model: Admin,
			data: {
				name: "jerusa",
				email: "jerusalemroronoa@gmail.com",
				password: "Hamle0727"
			}
		},
		{
			type: "doctor",
			model: Doctor,
			data: {
				name: "Dr Etsub Zewdu",
				email: "jerrykpoper2@gmail.com",
				password: "Hamle0727",
				phone: "N/A",
				specialty: "General Medicine",
				experience: 5,
				qualifications: "MBBS"
			}
		}
	];

	for (const entry of seedEntries) {
		const existing = await entry.model.findOne({ email: entry.data.email });
		if (!existing) {
			await entry.model.create(entry.data);
			console.log(`[seed] Created ${entry.type}: ${entry.data.email}`);
		} else {
			console.log(`[seed] ${entry.type} exists: ${entry.data.email}`);
		}
	}
}