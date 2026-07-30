import express from "express";
import { createContactMessage, getContactMessages } from "../controllers/contactController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .post(createContactMessage)
  .get(protect, getContactMessages);

export default router;
