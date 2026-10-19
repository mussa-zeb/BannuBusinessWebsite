import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  protect,
  allowRoles("admin"),
  validateBody(["name"]),
  createCategory
);

router.put("/:id", protect, allowRoles("admin"), updateCategory);

router.delete("/:id", protect, allowRoles("admin"), deleteCategory);

export default router;