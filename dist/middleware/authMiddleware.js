"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "supersecretkey_change_me_in_production");
        req.admin = await Admin_1.default.findById(decoded.id).select("-password");
        if (!req.admin) {
            res.status(401).json({ message: "Not authorized, admin account not found" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error.message);
        res.status(401).json({ message: "Not authorized, invalid or expired token" });
    }
};
exports.protect = protect;
