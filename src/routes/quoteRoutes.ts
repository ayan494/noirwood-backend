import express from "express";
import { createQuoteRequest, getQuoteRequests } from "../controllers/quoteController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .post(createQuoteRequest)
  .get(protect, getQuoteRequests);

export default router;
