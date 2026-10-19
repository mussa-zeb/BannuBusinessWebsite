import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const safeUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  image: user.image,
  role: user.role,
  isActive: user.isActive,
  shopName: user.shopName,
  shopDescription: user.shopDescription,
  shopLogo: user.shopLogo,
  shopBanner: user.shopBanner,
  createdAt: user.createdAt,
});

// ======================================================
// REGISTER
// ======================================================
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const selectedRole = ["customer", "seller", "admin"].includes(role)
      ? role
      : "customer";

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    if (selectedRole === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message: "Admin already exists.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim() || "",
      role: selectedRole,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message:
        selectedRole === "admin"
          ? "Admin registered successfully. Please login."
          : selectedRole === "seller"
          ? "Seller account created successfully. Please login."
          : "Registration successful. Please login.",
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Registration failed." });
  }
};

// ======================================================
// LOGIN
// ======================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: safeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Login failed." });
  }
};

// ======================================================
// LOGOUT
// ======================================================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful." });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Logout failed." });
  }
};

// ======================================================
// GET CURRENT USER
// ======================================================
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({ success: true, user: safeUser(req.user) });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Unable to get current user." });
  }
};

// ======================================================
// GET ALL USERS (admin)
// ======================================================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, count: users.length, users });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Unable to fetch users." });
  }
};

// ======================================================
// GET USER BY ID (admin)
// ======================================================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, user });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Unable to fetch user." });
  }
};

// ======================================================
// DELETE USER (admin)
// ======================================================
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.user._id.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account.",
      });
    }
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Unable to delete user." });
  }
};

// ======================================================
// UPDATE PROFILE
// ======================================================
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      image,
      address,
      shopName,
      shopDescription,
      shopLogo,
      shopBanner,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must contain at least 2 characters.",
        });
      }
      user.name = name.trim();
    }
    if (phone !== undefined) user.phone = phone.trim();
    if (image !== undefined) user.image = image;
    if (address !== undefined) user.address = address.trim();

    if (user.role === "seller") {
      if (shopName !== undefined) user.shopName = shopName.trim();
      if (shopDescription !== undefined)
        user.shopDescription = shopDescription.trim();
      if (shopLogo !== undefined) user.shopLogo = shopLogo;
      if (shopBanner !== undefined) user.shopBanner = shopBanner;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser(user),
    });
  } catch (error) {
    console.error("updateProfile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to update profile." });
  }
};

// ======================================================
// CHANGE PASSWORD
// ======================================================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("changePassword:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to change password.",
    });
  }
};