import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname) || "";
		cb(null, `prescription-${unique}${ext}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"]; 
	if (allowed.includes(file.mimetype)) return cb(null, true);
	cb(new Error("Invalid file type"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/prescriptions", upload.single("prescription"), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: "No file uploaded" });
	}
	const publicUrl = `/uploads/${req.file.filename}`;
	res.status(201).json({ url: publicUrl, filename: req.file.filename });
});

export default router;
