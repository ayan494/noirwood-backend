"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuoteStatus = exports.getQuoteRequests = exports.createQuoteRequest = void 0;
const Quote_1 = __importDefault(require("../models/Quote"));
const createQuoteRequest = async (req, res) => {
    try {
        const { name, email, phone, country, message, productName, productId, productImage } = req.body;
        if (!name || !email || !phone || !productName || !message) {
            res.status(400).json({ success: false, message: "Required fields missing" });
            return;
        }
        const newQuote = await Quote_1.default.create({
            name,
            email,
            phone,
            country: country || "Pakistan",
            message,
            productName,
            productId: productId || "",
            productImage: productImage || "",
            status: "pending",
        });
        const whatsappNumber = "923142412744";
        const whatsappText = `*New Quote Request*\n\nCustomer Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nCountry: ${country || "Pakistan"}\nProduct: ${productName}${productId ? ` (ID: ${productId})` : ""}\n\nMessage:\n${message}`;
        res.status(201).json({
            success: true,
            message: "Quote request submitted successfully",
            quote: newQuote,
            whatsappNumber,
            whatsappMessage: whatsappText,
            whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to submit quote request" });
    }
};
exports.createQuoteRequest = createQuoteRequest;
const getQuoteRequests = async (req, res) => {
    try {
        const quotes = await Quote_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, count: quotes.length, quotes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch quote requests" });
    }
};
exports.getQuoteRequests = getQuoteRequests;
const updateQuoteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const quote = await Quote_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!quote) {
            res.status(404).json({ success: false, message: "Quote request not found" });
            return;
        }
        res.json({ success: true, quote });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to update quote request status" });
    }
};
exports.updateQuoteStatus = updateQuoteStatus;
