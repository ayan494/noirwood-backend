"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
router
    .route("/")
    .get(productController_1.getProducts)
    .post(authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.productSchema), productController_1.createProduct);
router.get("/slug/:slug", productController_1.getProductBySlug);
router.get("/:id/related", productController_1.getRelatedProducts);
router
    .route("/:id")
    .get(productController_1.getProductById)
    .put(authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.productSchema), productController_1.updateProduct)
    .delete(authMiddleware_1.protect, productController_1.deleteProduct);
exports.default = router;
