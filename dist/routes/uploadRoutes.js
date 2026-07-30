"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Allow flexible field names ('image', 'file', etc.)
router.post("/", authMiddleware_1.protect, uploadMiddleware_1.default.any(), uploadController_1.uploadFile);
exports.default = router;
