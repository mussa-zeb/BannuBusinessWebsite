import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Seller-specific fields
    shopName: {
      type: String,
      default: "",
      trim: true,
    },

    shopDescription: {
      type: String,
      default: "",
      trim: true,
    },

    shopLogo: {
      type: String,
      default: "",
    },

    shopBanner: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;