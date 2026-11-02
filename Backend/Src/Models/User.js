import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["customer", "support_agent", "admin"],
      default: "customer",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

