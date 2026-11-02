import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
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
      lowercase: true,
      trim: true,
      unique: true,
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
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 30 * 60 * 1000),
    },
  },
  { timestamps: true }
);

pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingRegistration = mongoose.model(
  "PendingRegistration",
  pendingRegistrationSchema
);

export default PendingRegistration;
