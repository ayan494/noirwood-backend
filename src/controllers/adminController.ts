import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin";
import Product from "../models/Product";
import Category from "../models/Category";
import Quote from "../models/Quote";
import Contact from "../models/Contact";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretkey_change_me_in_production", {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });
};

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (admin && admin.password && (await bcrypt.compare(password, admin.password))) {
      const token = generateToken(admin._id.toString());
      res.json({
        success: true,
        message: "Admin authenticated successfully",
        _id: admin._id,
        email: admin.email,
        token,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error during authentication" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = (req as any).user;
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const logoutAdmin = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: "Successfully logged out" });
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [productsCount, categoriesCount, quotesCount, messagesCount, recentQuotes, recentProducts] =
      await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Quote.countDocuments(),
        Contact.countDocuments(),
        Quote.find().sort({ createdAt: -1 }).limit(5),
        Product.find().populate("category", "name slug").sort({ createdAt: -1 }).limit(5),
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch dashboard stats" });
  }
};
