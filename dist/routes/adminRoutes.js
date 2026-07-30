"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const productController_1 = require("../controllers/productController");
const categoryController_1 = require("../controllers/categoryController");
const quoteController_1 = require("../controllers/quoteController");
const contactController_1 = require("../controllers/contactController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
// Auth routes
router.post("/login", (0, validateMiddleware_1.validate)(validators_1.adminLoginSchema), adminController_1.loginAdmin);
router.post("/logout", adminController_1.logoutAdmin);
router.get("/me", authMiddleware_1.protect, adminController_1.getMe);
router.get("/dashboard", authMiddleware_1.protect, adminController_1.getDashboardStats);
// Product Admin Routes: /api/admin/products
router
    .route("/products")
    .get(authMiddleware_1.protect, productController_1.getProducts)
    .post(authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.productSchema), productController_1.createProduct);
router
    .route("/products/:id")
    .get(authMiddleware_1.protect, productController_1.getProductById)
    .put(authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.productSchema), productController_1.updateProduct)
    .delete(authMiddleware_1.protect, productController_1.deleteProduct);
router.post("/products/:id/duplicate", authMiddleware_1.protect, productController_1.duplicateProduct);
// Category Admin Routes: /api/admin/categories
router.put("/categories/reorder", authMiddleware_1.protect, categoryController_1.reorderCategories);
router
    .route("/categories")
    .get(authMiddleware_1.protect, categoryController_1.getCategories)
    .post(authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.categorySchema), categoryController_1.createCategory);
router
    .route("/categories/:id")
    .get(authMiddleware_1.protect, categoryController_1.getCategoryById)
    .put(authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.categorySchema), categoryController_1.updateCategory)
    .delete(authMiddleware_1.protect, categoryController_1.deleteCategory);
// Quote Requests Admin Routes: /api/admin/quote-requests
router.get("/quote-requests", authMiddleware_1.protect, quoteController_1.getQuoteRequests);
router.put("/quote-requests/:id", authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.statusUpdateSchema), quoteController_1.updateQuoteStatus);
// Messages Admin Routes: /api/admin/messages
router.get("/messages", authMiddleware_1.protect, contactController_1.getContactMessages);
router.put("/messages/:id", authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.statusUpdateSchema), contactController_1.updateContactStatus);
exports.default = router;
