import express from "express";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
  getSellerCustomers,
  getSellerStats,
  getSellerPayments,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Customer
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

// Seller
router.get("/seller", protect, allowRoles("seller", "admin"), getSellerOrders);
router.get("/seller/customers", protect, allowRoles("seller", "admin"), getSellerCustomers);
router.get("/seller/stats", protect, allowRoles("seller", "admin"), getSellerStats);
router.get("/seller/payments", protect, allowRoles("seller", "admin"), getSellerPayments);
router.put("/:id/status", protect, allowRoles("seller", "admin"), updateOrderStatus);

export default router;