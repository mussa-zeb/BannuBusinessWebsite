import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication.",
    });
  }
};

export const customerOnly = (req, res, next) => {
  if (req.user?.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Customer access only.",
    });
  }
  next();
};

export const sellerOnly = (req, res, next) => {
  if (req.user?.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Seller access only.",
    });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only.",
    });
  }
  next();
};

export default protect;