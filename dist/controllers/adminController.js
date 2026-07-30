"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.logoutAdmin = exports.getMe = exports.loginAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const Quote_1 = __importDefault(require("../models/Quote"));
const Contact_1 = __importDefault(require("../models/Contact"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || "supersecretkey_change_me_in_production", {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d"),
    });
};
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required" });
            return;
        }
        const normalizedEmail = email.toLowerCase().trim();
        const admin = await Admin_1.default.findOne({ email: normalizedEmail });
        if (admin && admin.password && (await bcryptjs_1.default.compare(password, admin.password))) {
            const token = generateToken(admin._id.toString());
            res.json({
                success: true,
                message: "Admin authenticated successfully",
                _id: admin._id,
                email: admin.email,
                token,
            });
        }
        else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error during authentication" });
    }
};
exports.loginAdmin = loginAdmin;
const getMe = async (req, res) => {
    try {
        const admin = req.user;
        if (!admin) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        res.json({
            success: true,
            admin: {
                _id: admin._id,
                email: admin.email,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
exports.getMe = getMe;
const logoutAdmin = async (req, res) => {
    res.json({ success: true, message: "Successfully logged out" });
};
exports.logoutAdmin = logoutAdmin;
const getDashboardStats = async (req, res) => {
    try {
        const [productsCount, categoriesCount, quotesCount, messagesCount, recentQuotes, recentProducts] = await Promise.all([
            Product_1.default.countDocuments(),
            Category_1.default.countDocuments(),
            Quote_1.default.countDocuments(),
            Contact_1.default.countDocuments(),
            Quote_1.default.find().sort({ createdAt: -1 }).limit(5),
            Product_1.default.find().populate("category", "name slug").sort({ createdAt: -1 }).limit(5),
        ]);
        res.json({
            success: true,
            stats: {
                products: productsCount,
                categories: categoriesCount,
                quoteRequests: quotesCount,
                inquiries: quotesCount,
                messages: messagesCount,
            },
            recentQuotes,
            recentProducts,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch dashboard stats" });
    }
};
exports.getDashboardStats = getDashboardStats;
