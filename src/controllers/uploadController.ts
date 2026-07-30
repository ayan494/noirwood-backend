import { Request, Response } from "express";

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const files: Express.Multer.File[] = [];
    
    if (req.file) {
      files.push(req.file);
    }
    
    if (Array.isArray(req.files)) {
      files.push(...req.files);
    } else if (req.files && typeof req.files === "object") {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          files.push(...fileArray);
        }
      });
    }

    if (files.length === 0) {
      res.status(400).json({ success: false, message: "No image files uploaded" });
      return;
    }

    // Cloudinary dynamic integration if env keys are present
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const urls: string[] = [];

    if (cloudName && apiKey && apiSecret) {
      try {
        const cloudinary = require("cloudinary").v2;
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        });

        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "noirwood/products",
          });
          urls.push(result.secure_url);
        }
      } catch (cloudErr) {
        console.warn("Cloudinary upload fallback to local storage:", cloudErr);
        files.forEach((file) => {
          urls.push(`/uploads/${file.filename}`);
        });
      }
    } else {
      files.forEach((file) => {
        urls.push(`/uploads/${file.filename}`);
      });
    }

    res.json({
      success: true,
      message: "Files uploaded successfully",
      url: urls[0],
      urls,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to upload files" });
  }
};
