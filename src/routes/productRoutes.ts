import express from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} from "../controllers/productController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { productSchema } from "../utils/validators";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, validate(productSchema), createProduct);

router.get("/slug/:slug", getProductBySlug);
router.get("/:id/related", getRelatedProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, validate(productSchema), updateProduct)
  .delete(protect, deleteProduct);

export default router;
