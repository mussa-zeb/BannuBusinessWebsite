import express from "express";
import {
  register, login, logout, getMe, getUsers, getUserById, deleteUser,
  updateProfile, changePassword,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { validateBody, validateEmail, validatePassword } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", authLimiter, validateBody(["name", "email", "password"]), validateEmail, validatePassword(6), register);
router.post("/login", authLimiter, validateBody(["email", "password"]), validateEmail, login);
router.post("/logout", logout);

router.get("/me", protect, getMe);
router.get("/profile", protect, (req, res) => res.status(200).json({ success: true, user: req.user }));
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

router.get("/", protect, allowRoles("admin"), getUsers);
router.get("/:id", protect, allowRoles("admin"), getUserById);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

export default router;