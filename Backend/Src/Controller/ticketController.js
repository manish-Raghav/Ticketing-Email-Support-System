import ticketService from "../Service/ticketService.js";

const respond = (res, status, message, data) => res.status(status).json({ success: true, message, data });

export const getAllTickets = async (req, res, next) => {
  try { return respond(res, 200, "Tickets fetched successfully.", await ticketService.getAllTickets(req.user, req.query)); }
  catch (error) { next(error); }
};
export const createTicket = async (req, res, next) => {
  try { return respond(res, 201, "Ticket created successfully.", { ticket: await ticketService.createTicket(req.user, req.body) }); }
  catch (error) { next(error); }
};
export const getTicketById = async (req, res, next) => {
  try { return respond(res, 200, "Ticket fetched successfully.", { ticket: await ticketService.getTicketById(req.user, req.params.ticketId) }); }
  catch (error) { next(error); }
};
export const updateTicket = async (req, res, next) => {
  try { return respond(res, 200, "Ticket updated successfully.", { ticket: await ticketService.updateTicket(req.user, req.params.ticketId, req.body) }); }
  catch (error) { next(error); }
};
export const assignTicket = async (req, res, next) => {
  try { return respond(res, 200, "Ticket assigned successfully.", { ticket: await ticketService.assignTicket(req.user, req.params.ticketId, req.body) }); }
  catch (error) { next(error); }
};
export const resolveTicket = async (req, res, next) => {
  try { return respond(res, 200, "Ticket resolved successfully.", { ticket: await ticketService.resolveTicket(req.user, req.params.ticketId) }); }
  catch (error) { next(error); }
};
export const reopenTicket = async (req, res, next) => {
  try { return respond(res, 200, "Ticket reopened successfully.", { ticket: await ticketService.reopenTicket(req.user, req.params.ticketId) }); }
  catch (error) { next(error); }
};
export const closeTicket = async (req, res, next) => {
  try { return respond(res, 200, "Ticket closed successfully.", { ticket: await ticketService.closeTicket(req.user, req.params.ticketId) }); }
  catch (error) { next(error); }
};
export const getMessages = async (req, res, next) => {
  try { return respond(res, 200, "Ticket conversation fetched successfully.", { messages: await ticketService.getMessages(req.user, req.params.ticketId) }); }
  catch (error) { next(error); }
};
export const addMessage = async (req, res, next) => {
  try { return respond(res, 201, "Reply added successfully.", { message: await ticketService.addMessage(req.user, req.params.ticketId, req.body) }); }
  catch (error) { next(error); }
};
export const getActivity = async (req, res, next) => {
  try { return respond(res, 200, "Ticket activity fetched successfully.", { activities: await ticketService.getActivity(req.user, req.params.ticketId) }); }
  catch (error) { next(error); }
};
