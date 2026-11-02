
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../Models/User.js";
import validatePassword from "../utils/passwordValidator.js";

const createAdmin = async () => {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    // Check required environment variables
    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      throw new Error(passwordError);
    }

    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // Prevent duplicate Admin creation or accidental account promotion
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email already exists. No account was created or changed."
      );
    }

    // Hash password using the same method as AuthService
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create first Admin
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
      isActive: true,
    });

    console.log("Admin created successfully!");
    console.log("Admin Email:", admin.email);
    console.log("Admin ID:", admin._id);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

createAdmin();
