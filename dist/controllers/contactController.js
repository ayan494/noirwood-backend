"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactStatus = exports.getContactMessages = exports.createContactMessage = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const createContactMessage = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ success: false, message: "Name, email and message are required" });
            return;
        }
        const contact = await Contact_1.default.create({
            name,
            email,
            phone: phone || "",
            subject: subject || "General Inquiry",
            message,
            status: "new",
        });
        const whatsappNumber = "923142412744";
        const whatsappText = `*New Contact Inquiry*\n\nCustomer Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nSubject: ${subject || "General Inquiry"}\n\nMessage:\n${message}`;
        res.status(201).json({
            success: true,
            message: "Contact message received successfully",
            contact,
            whatsappNumber,
            whatsappMessage: whatsappText,
            whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to save contact message" });
    }
};
exports.createContactMessage = createContactMessage;
const getContactMessages = async (req, res) => {
    try {
        const messages = await Contact_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, count: messages.length, messages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to fetch contact messages" });
    }
};
exports.getContactMessages = getContactMessages;
const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const contact = await Contact_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!contact) {
            res.status(404).json({ success: false, message: "Contact message not found" });
            return;
        }
        res.json({ success: true, contact });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to update contact status" });
    }
};
exports.updateContactStatus = updateContactStatus;
