import express from "express";
import rateLimit from "express-rate-limit";
import { getAIReply } from "../services/ai.js";

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Bohat zyada messages ho gaye. Thori der baad koshish karein.",
  },
});

router.post("/", chatLimiter, async (req, res) => {
  try {
    const { messages } = req.body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Messages array required.",
      });
    }

    const reply = await getAIReply(messages);

    return res.json({ success: true, reply });
  } catch (error) {
    const status = error.statusCode || error.status || 500;

    console.error("Chatbot error:", {
      status,
      code: error.code,
      message: error.message,
    });

    return res.status(status).json({
      success: false,
      message: error.message || "Chatbot mein masla aa gaya.",
    });
  }
});

export default router;