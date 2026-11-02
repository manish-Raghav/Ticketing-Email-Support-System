import mongoose from "mongoose";

const ticketActivitySchema = new mongoose.Schema(
  {
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true, index: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    actorName: { type: String, trim: true, default: "System" },
    actorRole: { type: String, trim: true, default: "system" },
    action: { type: String, required: true, trim: true },
    oldValue: { type: mongoose.Schema.Types.Mixed, default: null },
    newValue: { type: mongoose.Schema.Types.Mixed, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    visibility: { type: String, enum: ["public", "internal"], default: "public" },
  },
  { timestamps: true }
);

ticketActivitySchema.index({ ticket: 1, createdAt: -1 });
const TicketActivity = mongoose.models.TicketActivity || mongoose.model("TicketActivity", ticketActivitySchema);
export default TicketActivity;
