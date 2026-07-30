import express from "express";
import { loginAdmin, getDashboardStats, getMe, logoutAdmin } from "../controllers/adminController";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  duplicateProduct,
} from "../controllers/productController";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../controllers/categoryController";
import { getQuoteRequests, updateQuoteStatus } from "../controllers/quoteController";
import { getContactMessages, updateContactStatus } from "../controllers/contactController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validateMiddleware";
import { adminLoginSchema, productSchema, categorySchema, statusUpdateSchema } from "../utils/validators";

const router = express.Router();

// Auth routes
router.post("/login", validate(adminLoginSchema), loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/me", protect, getMe);
router.get("/dashboard", protect, getDashboardStats);

// Product Admin Routes: /api/admin/products
router
  .route("/products")
  .get(protect, getProducts)
  .post(protect, validate(productSchema), createProduct);

router
  .route("/products/:id")
  .get(protect, getProductById)
  .put(protect, validate(productSchema), updateProduct)
  .delete(protect, deleteProduct);

router.post("/products/:id/duplicate", protect, duplicateProduct);

// Category Admin Routes: /api/admin/categories
router.put("/categories/reorder", protect, reorderCategories);

router
  .route("/categories")
  .get(protect, getCategories)
  .post(protect, validate(categorySchema), createCategory);

router
  .route("/categories/:id")
  .get(protect, getCategoryById)
  .put(protect, validate(categorySchema), updateCategory)
  .delete(protect, deleteCategory);

// Quote Requests Admin Routes: /api/admin/quote-requests
router.get("/quote-requests", protect, getQuoteRequests);
router.put("/quote-requests/:id", protect, validate(statusUpdateSchema), updateQuoteStatus);

// Messages Admin Routes: /api/admin/messages
router.get("/messages", protect, getContactMessages);
router.put("/messages/:id", protect, validate(statusUpdateSchema), updateContactStatus);

export default router;
