
import express from "express";

import {
  register,
  login,
  forgetPassword,
  resetPassword,
  verifyEmail,
} from "../Controller/authController.js";

import { protect } from "../Middleware/authMiddileware.js";

const router = express.Router();

// Authentication
router.post("/register", register);
router.post("/login", login);

// Email verification
router.post("/verify-email", verifyEmail);

// Forgot and reset password
router.post("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);

// Protected profile API
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

export default router;
