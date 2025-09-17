import express from "express";
import { createBloodRequest, getBloodRequests, updateBloodRequest, deleteBloodRequest } from "../controllers/requestBloodController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getBloodRequests);
router.post("/", protect, createBloodRequest);
router.put("/:id", protect, updateBloodRequest);
router.delete("/:id", protect, deleteBloodRequest);

export default router;