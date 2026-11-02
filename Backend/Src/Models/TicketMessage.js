import mongoose from "mongoose";

const ticketMessageSchema = new mongoose.Schema(
  {
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    senderName: { type: String, trim: true, default: "" },
    senderEmail: { type: String, trim: true, lowercase: true, default: "" },
    senderRole: { type: String, enum: ["customer", "support_agent", "admin", "email"], required: true },
    type: { type: String, enum: ["public", "internal"], default: "public" },
    body: { type: String, required: true, trim: true, maxlength: 20000 },
    source: { type: String, enum: ["web", "email"], default: "web" },
    emailMessageId: { type: String, trim: true, default: undefined, unique: true, sparse: true },
  },
  { timestamps: true }
);

ticketMessageSchema.index({ ticket: 1, createdAt: 1 });
const TicketMessage = mongoose.models.TicketMessage || mongoose.model("TicketMessage", ticketMessageSchema);
export default TicketMessage;
