import express from "express";
import {
  getAllTickets, createTicket, getTicketById, updateTicket,
  assignTicket, resolveTicket, reopenTicket, closeTicket,
  getMessages, addMessage, getActivity,
} from "../Controller/ticketController.js";
import { protect } from "../Middleware/authMiddileware.js";

const ticketRouter = express.Router();
ticketRouter.use(protect);

ticketRouter.get("/", getAllTickets);
ticketRouter.post("/", createTicket);
ticketRouter.post("/:ticketId/assign", assignTicket);
ticketRouter.post("/:ticketId/resolve", resolveTicket);
ticketRouter.post("/:ticketId/reopen", reopenTicket);
ticketRouter.post("/:ticketId/close", closeTicket);
ticketRouter.get("/:ticketId/messages", getMessages);
ticketRouter.post("/:ticketId/messages", addMessage);
ticketRouter.get("/:ticketId/activity", getActivity);
ticketRouter.get("/:ticketId", getTicketById);
ticketRouter.patch("/:ticketId", updateTicket);

export default ticketRouter;
