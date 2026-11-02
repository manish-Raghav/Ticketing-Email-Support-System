import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true, trim: true, index: true },
    subject: { type: String, required: true, trim: true, minlength: 5, maxlength: 150 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 10000 },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    // Category is stored as the selected category name, not a Category ObjectId.
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Technical Support", "Account", "Billing", "General Inquiry"],
    },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    status: {
      type: String,
      enum: ["open", "pending", "in_progress", "resolved", "closed", "reopened", "waiting_for_customer", "waiting_for_agent"],
      default: "open",
      index: true,
    },
    source: { type: String, enum: ["web", "email"], default: "web" },
    attachments: [{ originalName: String, fileName: String, mimeType: String, size: Number, path: String }],
    lastMessageAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

ticketSchema.index({ requester: 1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ status: 1, priority: 1 });

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
export default Ticket;
