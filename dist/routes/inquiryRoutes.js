"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inquiryController_1 = require("../controllers/inquiryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateMiddleware_1 = require("../middleware/validateMiddleware");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
router
    .route("/")
    .post((0, validateMiddleware_1.validate)(validators_1.inquirySchema), inquiryController_1.createInquiry)
    .get(authMiddleware_1.protect, inquiryController_1.getInquiries);
router.put("/:id/status", authMiddleware_1.protect, (0, validateMiddleware_1.validate)(validators_1.statusUpdateSchema), inquiryController_1.updateInquiryStatus);
exports.default = router;
