import express from "express";
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { categorySchema } from "../utils/validators";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, validate(categorySchema), createCategory);

router.get("/slug/:slug", getCategoryBySlug);

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, validate(categorySchema), updateCategory)
  .delete(protect, deleteCategory);

export default router;
