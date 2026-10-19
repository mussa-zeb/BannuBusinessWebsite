import express from "express";
import {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Seller
router.get("/seller/my", protect, allowRoles("seller", "admin"), getMyProducts);
router.post("/", protect, allowRoles("seller", "admin"), createProduct);
router.put("/:id", protect, allowRoles("seller", "admin"), updateProduct);
router.delete("/:id", protect, allowRoles("seller", "admin"), deleteProduct);

export default router;