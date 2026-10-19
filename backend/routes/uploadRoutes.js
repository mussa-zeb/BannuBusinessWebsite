import express from "express";
import multer from "multer";
import fs from "fs";
import os from "os";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Cross-platform temp directory: /tmp on Linux/macOS, C:\...\Temp on Windows
const upload = multer({ dest: os.tmpdir() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "bannu-marketplace",
    });

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {}
    }
    console.error("Cloudinary Upload Error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Upload failed" });
  }
});

export default router;