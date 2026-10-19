import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "bannu-marketplace",
    });

    // Cleanup local temp file
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: err.message || "Internal server error during upload." });
  }
};