"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInquiryStatus = exports.getInquiries = exports.createInquiry = void 0;
const Inquiry_1 = __importDefault(require("../models/Inquiry"));
const emailService_1 = require("../services/emailService");
const createInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry_1.default.create(req.body);
        // Send email to business owner
        await (0, emailService_1.sendEmail)({
            to: process.env.EMAIL_USER,
            subject: `New Inquiry for ${inquiry.productName} from ${inquiry.customerName}`,
            html: `
        <h3>New Inquiry Received</h3>
        <p><strong>Customer:</strong> ${inquiry.customerName}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone || "N/A"}</p>
        <p><strong>Product:</strong> ${inquiry.productName}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
      `,
        });
        // Send confirmation to customer
        await (0, emailService_1.sendEmail)({
            to: inquiry.email,
            subject: "We received your inquiry - Noirwood",
            html: `
        <h3>Thank you for your inquiry, ${inquiry.customerName}!</h3>
        <p>We have received your interest in the <strong>${inquiry.productName}</strong>.</p>
        <p>Our team will review your request and get back to you shortly.</p>
        <br/>
        <p>Best Regards,</p>
        <p>The Noirwood Team</p>
      `,
        });
        res.status(201).json(inquiry);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createInquiry = createInquiry;
const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry_1.default.find({}).sort({ createdAt: -1 });
        res.json(inquiries);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getInquiries = getInquiries;
const updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry_1.default.findById(req.params.id);
        if (!inquiry) {
            res.status(404).json({ message: "Inquiry not found" });
            return;
        }
        inquiry.status = status;
        const updatedInquiry = await inquiry.save();
        res.json(updatedInquiry);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateInquiryStatus = updateInquiryStatus;
