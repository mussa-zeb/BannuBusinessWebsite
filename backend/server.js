// ============================================================
// ✅ MUST BE FIRST — fixes querySrv ECONNREFUSED on Windows
// ============================================================
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import corsMiddleware from "./config/cors.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import chatRoute from "./routes/chat.route.js";

const app = express();

app.set("trust proxy", 1);

app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health checks BEFORE DB middleware so they always respond
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bannu Marketplace API is running",
    dbConnected: !!global.mongoose?.conn,
    dnsServers: dns.getServers(),
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Bannu Marketplace API is running",
    dbConnected: !!global.mongoose?.conn,
  });
});

// Ensure DB connection for all real API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB middleware error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed. Check MONGO_URI in backend/.env.",
    });
  }
});

app.use(apiLimiter);

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/chat", chatRoute);

app.use(notFound);
app.use(errorHandler);

const isVercel = process.env.VERCEL === "1";

if (!isVercel) {
  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () =>
    console.log(`✅ Server running on http://localhost:${PORT}`)
  );
}

export default app;