import express from "express";
import {
  getAdminStats,
  getSellers,
  getSellerDetail,
  getAllOrders,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, allowRoles("admin"));

router.get("/stats", getAdminStats);
router.get("/sellers", getSellers);
router.get("/sellers/:id", getSellerDetail);
router.get("/orders", getAllOrders);

export default router;