"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER ||
        !process.env.EMAIL_PASS ||
        process.env.EMAIL_PASS === "your_app_password_here") {
        console.warn("[EmailService] Email credentials not configured. Skipping email dispatch.");
        return;
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: `"Noirwood" <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };
        await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error("[EmailService] Email sending failed:", error);
        // Non-blocking log so DB operations still succeed
    }
};
exports.sendEmail = sendEmail;
