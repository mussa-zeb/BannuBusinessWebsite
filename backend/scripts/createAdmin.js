import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected...");

    const adminEmail = "faizan@gmail.com";
    const adminPassword = "faizan12345";

    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.name = "Bannu Administrator";
      existingAdmin.password = hashedPassword;
      existingAdmin.phone = "";
      existingAdmin.role = "admin";
      existingAdmin.isActive = true;
      await existingAdmin.save();

      console.log("Existing admin account updated.");
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = await User.create({
      name: "Bannu Administrator",
      email: adminEmail,
      password: hashedPassword,
      phone: "",
      role: "admin",
      isActive: true,
    });

    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("Email:", admin.email);
    console.log("Password:", adminPassword);
    console.log("Role:", admin.role);
    console.log("================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Create Admin Error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();