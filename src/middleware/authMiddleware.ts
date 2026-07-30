import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export interface AuthRequest extends Request {
  admin?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
    return;
  }

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey_change_me_in_production"
    );

    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) {
      res.status(401).json({ message: "Not authorized, admin account not found" });
      return;
    }

    next();
  } catch (error: any) {
    console.error("JWT verification error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};
