import { Request, Response } from "express";
import Contact from "../models/Contact";

export const createContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: "Name, email and message are required" });
      return;
    }

    const contact = await Contact.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to save contact message" });
  }
};

export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch contact messages" });
  }
};

export const updateContactStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) {
      res.status(404).json({ success: false, message: "Contact message not found" });
      return;
    }

    res.json({ success: true, contact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update contact status" });
  }
};
