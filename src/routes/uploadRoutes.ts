import express from "express";
import { uploadFile } from "../controllers/uploadController";
import upload from "../middleware/uploadMiddleware";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Allow flexible field names ('image', 'file', etc.)
router.post("/", protect, upload.any(), uploadFile);

export default router;
