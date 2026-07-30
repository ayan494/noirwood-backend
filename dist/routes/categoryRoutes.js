"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
router
    .route("/")
    .get(categoryController_1.getCategories)
    .post(authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.categorySchema), categoryController_1.createCategory);
router.get("/slug/:slug", categoryController_1.getCategoryBySlug);
router
    .route("/:id")
    .get(categoryController_1.getCategoryById)
    .put(authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.categorySchema), categoryController_1.updateCategory)
    .delete(authMiddleware_1.protect, categoryController_1.deleteCategory);
exports.default = router;
