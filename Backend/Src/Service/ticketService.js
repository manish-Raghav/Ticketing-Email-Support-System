
import mongoose from "mongoose";
import ticketRepository from "../Repository/ticketRepository.js";
import generateTicketNumber from "../utils/generateTicketNumber.js";
import ticketEmailService from "./ticketEmailService.js";

const ALLOWED_PRIORITIES = ["low", "medium", "high", "urgent"];
const ALLOWED_CATEGORIES = [
  "Technical Support",
  "Account",
  "Billing",
  "General Inquiry",
];
const ALLOWED_STATUSES = [
  "open",
  "pending",
  "in_progress",
  "resolved",
  "closed",
  "reopened",
  "waiting_for_customer",
  "waiting_for_agent",
];

const isAgent = (role) => role === "support_agent";

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validId = (id) => mongoose.isValidObjectId(id);
const idOf = (value) => value?._id?.toString?.() || value?.toString?.() || "";
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const canAccessTicket = (ticket, user) => {
  if (user.role === "admin") return true;
  if (user.role === "customer") {
    return idOf(ticket.requester) === idOf(user._id);
  }
  if (isAgent(user.role)) {
    return idOf(ticket.assignedTo) === idOf(user._id);
  }
  return false;
};

const requireTicket = async (user, ticketId) => {
  if (!validId(ticketId)) {
    throw createError("Invalid ticket ID.", 400);
  }

  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) {
    throw createError("Ticket not found.", 404);
  }

  if (!canAccessTicket(ticket, user)) {
    throw createError(
      "You are not authorized to access this ticket.",
      403
    );
  }

  return ticket;
};

const logActivity = (ticket, user, action, options = {}) =>
  ticketRepository.createActivity({
    ticket: ticket._id,
    actor: user?._id || null,
    actorName: user?.name || "Email system",
    actorRole: user?.role || "system",
    action,
    oldValue: options.oldValue ?? null,
    newValue: options.newValue ?? null,
    metadata: options.metadata || {},
    visibility: options.visibility || "public",
  });

// Send status notification without affecting ticket operations.
const notifyStatusChange = async (ticket, oldStatus, newStatus) => {
  if (!oldStatus || oldStatus === newStatus) return;

  try {
    const admins = await ticketRepository.findActiveAdmins();

    await ticketEmailService.notifyTicketStatusChanged(
      ticket,
      oldStatus,
      newStatus,
      admins
    );
  } catch (error) {
    console.error(
      "Ticket status notification failed:",
      error.message
    );
  }
};

const getAllTickets = async (user, query = {}) => {
  if (!user?._id || !user?.role) {
    throw createError("Unauthorized user.", 401);
  }

  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(query.limit, 10) || 10, 1),
    100
  );

  const filter = {};

  if (user.role === "customer") {
    filter.requester = user._id;
  } else if (isAgent(user.role)) {
    filter.assignedTo = user._id;
  } else if (user.role !== "admin") {
    throw createError("You are not authorized to view tickets.", 403);
  }

  if (query.status) {
    if (!ALLOWED_STATUSES.includes(query.status)) {
      throw createError("Invalid ticket status.", 400);
    }
    filter.status = query.status;
  }

  if (query.priority) {
    if (!ALLOWED_PRIORITIES.includes(query.priority)) {
      throw createError("Invalid ticket priority.", 400);
    }
    filter.priority = query.priority;
  }

  if (query.category) {
    if (!ALLOWED_CATEGORIES.includes(query.category)) {
      throw createError("Invalid ticket category.", 400);
    }
    filter.category = query.category;
  }

  if (query.search?.trim()) {
    const search = escapeRegex(query.search.trim());

    filter.$or = [
      { ticketNumber: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "priority",
    "status",
    "ticketNumber",
    "lastMessageAt",
  ];

  const sortField = allowedSortFields.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const sort = {
    [sortField]: query.order === "asc" ? 1 : -1,
  };

  const [tickets, totalTickets] = await Promise.all([
    ticketRepository.findTickets(
      filter,
      (page - 1) * limit,
      limit,
      sort
    ),
    ticketRepository.countTickets(filter),
  ]);

  const totalPages = Math.ceil(totalTickets / limit);

  return {
    tickets,
    pagination: {
      currentPage: page,
      totalPages,
      totalTickets,
      limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const createTicket = async (user, data) => {
  if (user?.role !== "customer") {
    throw createError("Only customers can create tickets.", 403);
  }

  const { subject, description, category, priority = "medium" } = data;

  if (
    typeof subject !== "string" ||
    typeof description !== "string" ||
    typeof category !== "string" ||
    !subject.trim() ||
    !description.trim() ||
    !category.trim()
  ) {
    throw createError(
      "Subject, description, and category are required.",
      400
    );
  }

  if (subject.trim().length < 5 || subject.trim().length > 150) {
    throw createError(
      "Subject must be between 5 and 150 characters.",
      400
    );
  }

  if (
    description.trim().length < 10 ||
    description.trim().length > 10000
  ) {
    throw createError(
      "Description must be between 10 and 10000 characters.",
      400
    );
  }

  const normalizedCategory = category.trim();

  if (!ALLOWED_CATEGORIES.includes(normalizedCategory)) {
    throw createError(
      `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`,
      400
    );
  }

  const categoryExists =
    await ticketRepository.findCategoryByName(normalizedCategory);

  if (!categoryExists) {
    throw createError(
      "Category is not available. Please select an active category.",
      400
    );
  }

  if (!ALLOWED_PRIORITIES.includes(priority)) {
    throw createError("Invalid ticket priority.", 400);
  }

  const ticket = await ticketRepository.createTicket({
    ticketNumber: generateTicketNumber(),
    subject: subject.trim(),
    description: description.trim(),
    requester: user._id,
    category: normalizedCategory,
    priority,
    status: "open",
    source: "web",
    lastMessageAt: new Date(),
  });

  await Promise.all([
    ticketRepository.createMessage({
      ticket: ticket._id,
      sender: user._id,
      senderName: user.name,
      senderEmail: user.email,
      senderRole: user.role,
      type: "public",
      body: description.trim(),
      source: "web",
    }),
    logActivity(ticket, user, "ticket_created", {
      newValue: "open",
      metadata: {
        ticketNumber: ticket.ticketNumber,
        category: normalizedCategory,
      },
    }),
  ]);

  const createdTicket = await ticketRepository.findTicketById(ticket._id);

  try {
    const admins = await ticketRepository.findActiveAdmins();

    await ticketEmailService.notifyAdminsNewTicket(
      createdTicket,
      admins
    );
  } catch (error) {
    console.error(
      "New ticket admin notification failed:",
      error.message
    );
  }

  return createdTicket;
};

const getTicketById = async (user, ticketId) =>
  requireTicket(user, ticketId);

const updateTicket = async (user, ticketId, data) => {
  const ticket = await requireTicket(user, ticketId);
  const oldStatus = ticket.status;

  const updateData = {};

  const allowedFields =
    user.role === "customer"
      ? ["subject", "description"]
      : isAgent(user.role)
      ? ["status", "priority"]
      : user.role === "admin"
      ? ["subject", "description", "status", "priority", "assignedTo"]
      : [];

  if (!allowedFields.length) {
    throw createError("You are not authorized to update tickets.", 403);
  }

  if (
    user.role === "customer" &&
    !["open", "reopened"].includes(ticket.status)
  ) {
    throw createError(
      "You can only edit tickets that are open or reopened.",
      400
    );
  }

  const invalidFields = Object.keys(data).filter(
    (key) => !allowedFields.includes(key)
  );

  if (invalidFields.length) {
    throw createError(
      `You cannot update these fields: ${invalidFields.join(", ")}`,
      400
    );
  }

  if (data.subject !== undefined) {
    if (
      typeof data.subject !== "string" ||
      data.subject.trim().length < 5 ||
      data.subject.trim().length > 150
    ) {
      throw createError(
        "Subject must be between 5 and 150 characters.",
        400
      );
    }

    updateData.subject = data.subject.trim();
  }

  if (data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      data.description.trim().length < 10 ||
      data.description.trim().length > 10000
    ) {
      throw createError(
        "Description must be between 10 and 10000 characters.",
        400
      );
    }

    updateData.description = data.description.trim();
  }

  if (data.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(data.status)) {
      throw createError("Invalid ticket status.", 400);
    }

    updateData.status = data.status;

    if (data.status === "resolved") {
      updateData.resolvedAt = new Date();
    }

    if (data.status === "closed") {
      updateData.closedAt = new Date();
    }

    if (data.status === "reopened") {
      updateData.resolvedAt = null;
      updateData.closedAt = null;
    }
  }

  if (data.priority !== undefined) {
    if (!ALLOWED_PRIORITIES.includes(data.priority)) {
      throw createError("Invalid ticket priority.", 400);
    }

    updateData.priority = data.priority;
  }

  if (data.assignedTo !== undefined) {
    if (user.role !== "admin") {
      throw createError("Only admin can assign tickets.", 403);
    }

    if (data.assignedTo !== null && !validId(data.assignedTo)) {
      throw createError("Invalid assigned agent ID.", 400);
    }

    if (data.assignedTo === null) {
      updateData.assignedTo = null;
    } else {
      const agent = await ticketRepository.findUserById(data.assignedTo);

      if (!agent || agent.role !== "support_agent" || !agent.isActive) {
        throw createError("Active support agent not found.", 404);
      }

      updateData.assignedTo = data.assignedTo;
    }
  }

  if (!Object.keys(updateData).length) {
    throw createError(
      "No valid fields provided for update.",
      400
    );
  }

  const updated = await ticketRepository.updateTicketById(
    ticketId,
    updateData
  );

  await logActivity(ticket, user, "ticket_updated", {
    oldValue: null,
    newValue: updateData,
  });

  if (data.status !== undefined && oldStatus !== data.status) {
    await notifyStatusChange(ticket, oldStatus, data.status);
  }

  return updated;
};

const assignTicket = async (user, ticketId, data) => {
  if (user.role !== "admin") {
    throw createError(
      "Only admin can assign or reassign tickets.",
      403
    );
  }

  const ticket = await requireTicket(user, ticketId);

  if (!Object.prototype.hasOwnProperty.call(data, "assignedTo")) {
    throw createError(
      "assignedTo is required. Use null to unassign.",
      400
    );
  }

  let newAssignee = null;

  if (data.assignedTo !== null) {
    if (!validId(data.assignedTo)) {
      throw createError("Invalid support agent ID.", 400);
    }

    newAssignee = await ticketRepository.findUserById(data.assignedTo);

    if (
      !newAssignee ||
      newAssignee.role !== "support_agent" ||
      !newAssignee.isActive
    ) {
      throw createError("Active support agent not found.", 404);
    }
  }

  const oldAssigneeId = idOf(ticket.assignedTo) || null;

  const updated = await ticketRepository.updateTicketById(ticketId, {
    assignedTo: newAssignee?._id || null,
  });

  await logActivity(
    ticket,
    user,
    !newAssignee
      ? "ticket_unassigned"
      : oldAssigneeId
      ? "ticket_reassigned"
      : "ticket_assigned",
    {
      oldValue: oldAssigneeId,
      newValue: newAssignee?._id?.toString() || null,
      metadata: {
        previousAgent: ticket.assignedTo?.name || null,
        assignedAgent: newAssignee?.name || null,
      },
    }
  );

  return updated;
};

const resolveTicket = async (user, ticketId) => {
  if (!(user.role === "admin" || isAgent(user.role))) {
    throw createError(
      "Only an assigned support agent or admin can resolve a ticket.",
      403
    );
  }

  const ticket = await requireTicket(user, ticketId);

  if (["closed", "resolved"].includes(ticket.status)) {
    throw createError(`Ticket is already ${ticket.status}.`, 400);
  }

  const oldStatus = ticket.status;

  const updated = await ticketRepository.updateTicketById(ticketId, {
    status: "resolved",
    resolvedAt: new Date(),
  });

  await logActivity(ticket, user, "ticket_resolved", {
    oldValue: oldStatus,
    newValue: "resolved",
  });

  await notifyStatusChange(ticket, oldStatus, "resolved");

  return updated;
};

const reopenTicket = async (user, ticketId) => {
  const ticket = await requireTicket(user, ticketId);

  if (!["resolved", "closed"].includes(ticket.status)) {
    throw createError(
      "Only resolved or closed tickets can be reopened.",
      400
    );
  }

  const oldStatus = ticket.status;

  const updated = await ticketRepository.updateTicketById(ticketId, {
    status: "reopened",
    resolvedAt: null,
    closedAt: null,
  });

  await logActivity(ticket, user, "ticket_reopened", {
    oldValue: oldStatus,
    newValue: "reopened",
  });

  await notifyStatusChange(ticket, oldStatus, "reopened");

  return updated;
};

const closeTicket = async (user, ticketId) => {
  const ticket = await requireTicket(user, ticketId);

  if (ticket.status === "closed") {
    throw createError("Ticket is already closed.", 400);
  }

  const oldStatus = ticket.status;

  const updated = await ticketRepository.updateTicketById(ticketId, {
    status: "closed",
    closedAt: new Date(),
  });

  await logActivity(ticket, user, "ticket_closed", {
    oldValue: oldStatus,
    newValue: "closed",
  });

  await notifyStatusChange(ticket, oldStatus, "closed");

  return updated;
};

const getMessages = async (user, ticketId) => {
  const ticket = await requireTicket(user, ticketId);
  const filter = { ticket: ticket._id };

  if (user.role === "customer") {
    filter.type = "public";
  }

  return ticketRepository.findMessages(filter);
};

const addMessage = async (user, ticketId, data) => {
  const ticket = await requireTicket(user, ticketId);

  const body =
    typeof data.body === "string" ? data.body.trim() : "";

  if (!body || body.length > 20000) {
    throw createError(
      "Message body is required and must be under 20000 characters.",
      400
    );
  }

  const type = data.type || "public";

  if (!["public", "internal"].includes(type)) {
    throw createError(
      "Message type must be public or internal.",
      400
    );
  }

  if (user.role === "customer" && type !== "public") {
    throw createError(
      "Customers cannot create internal notes.",
      403
    );
  }

  const message = await ticketRepository.createMessage({
    ticket: ticket._id,
    sender: user._id,
    senderName: user.name,
    senderEmail: user.email,
    senderRole: user.role,
    type,
    body,
    source: "web",
  });

  await Promise.all([
    ticketRepository.updateTicketById(ticketId, {
      lastMessageAt: new Date(),
    }),
    logActivity(ticket, user, "message_added", {
      metadata: { messageId: message._id.toString() },
      visibility: type,
    }),
  ]);

  return message;
};

const getActivity = async (user, ticketId) => {
  const ticket = await requireTicket(user, ticketId);
  const filter = { ticket: ticket._id };

  if (user.role === "customer") {
    filter.visibility = "public";
  }

  return ticketRepository.findActivities(filter);
};

const getCategories = async () =>
  ticketRepository.findActiveCategories();

const getDashboardSummary = async (user) => {
  const filter = {};

  if (user.role === "customer") {
    filter.requester = user._id;
  } else if (isAgent(user.role)) {
    filter.assignedTo = user._id;
  } else if (user.role !== "admin") {
    throw createError(
      "You are not authorized to view dashboard statistics.",
      403
    );
  }

  const [total, byStatus, highPriority] = await Promise.all([
    ticketRepository.countTickets(filter),
    ticketRepository.countTicketsByStatus(filter),
    ticketRepository.countHighPriorityTickets(filter),
  ]);

  return {
    totalTickets: total,
    byStatus,
    highPriorityTickets: highPriority,
  };
};

// Generic inbound-email adapter: provider must forward a normalized payload and shared secret.
const receiveInboundEmail = async (payload) => {
  const { ticketNumber, from, text, messageId } = payload;

  if (!ticketNumber || !from || !text || !messageId) {
    throw createError(
      "ticketNumber, from, text, and messageId are required.",
      400
    );
  }

  if (
    typeof text !== "string" ||
    !text.trim() ||
    text.trim().length > 20000
  ) {
    throw createError(
      "Email text is empty or too long.",
      400
    );
  }

  const duplicate = await ticketRepository.findMessageByEmailId(messageId);

  if (duplicate) {
    return { duplicate: true, message: duplicate };
  }

  const ticket = await ticketRepository.findTicketByNumber(
    ticketNumber.trim()
  );

  if (!ticket) {
    throw createError(
      "Ticket not found for this email reply.",
      404
    );
  }

  const normalizedFrom = String(from).trim().toLowerCase();
  const requester = ticket.requester;
  const assignedTo = ticket.assignedTo;

  let sender = null;

  if (requester?.email?.toLowerCase() === normalizedFrom) {
    sender = requester;
  } else if (assignedTo?.email?.toLowerCase() === normalizedFrom) {
    sender = assignedTo;
  }

  if (!sender) {
    throw createError(
      "Sender email is not authorized to reply to this ticket.",
      403
    );
  }

  const message = await ticketRepository.createMessage({
    ticket: ticket._id,
    sender: sender._id,
    senderName: sender.name,
    senderEmail: normalizedFrom,
    senderRole: sender.role,
    type: "public",
    body: text.trim(),
    source: "email",
    emailMessageId: String(messageId),
  });

  await Promise.all([
    ticketRepository.updateTicketById(ticket._id, {
      lastMessageAt: new Date(),
    }),
    ticketRepository.createActivity({
      ticket: ticket._id,
      actor: sender._id,
      actorName: sender.name,
      actorRole: sender.role,
      action: "email_reply_received",
      metadata: { messageId: message._id.toString() },
      visibility: "public",
    }),
  ]);

  return { duplicate: false, message };
};

const ticketService = {
  getAllTickets,
  createTicket,
  getTicketById,
  updateTicket,
  assignTicket,
  resolveTicket,
  reopenTicket,
  closeTicket,
  getMessages,
  addMessage,
  getActivity,
  getCategories,
  getDashboardSummary,
  receiveInboundEmail,
};

export default ticketService;
