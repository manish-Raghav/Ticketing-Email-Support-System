
import Category from "../Models/Category.js";
import Ticket from "../Models/Ticket.js";
import TicketMessage from "../Models/TicketMessage.js";
import TicketActivity from "../Models/TicketActivity.js";
import { User } from "../Models/User.js";

const ticketPopulation = [
  { path: "requester", select: "name email role" },
  { path: "assignedTo", select: "name email role" },
];

const findTickets = (filter, skip, limit, sort) =>
  Ticket.find(filter).populate(ticketPopulation).sort(sort).skip(skip).limit(limit).lean();

const countTickets = (filter) => Ticket.countDocuments(filter);

const findTicketById = (ticketId) =>
  Ticket.findById(ticketId).populate(ticketPopulation).lean();

const updateTicketById = (ticketId, updateData) =>
  Ticket.findByIdAndUpdate(
    ticketId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate(ticketPopulation);

const findCategoryByName = (name) =>
  Category.findOne({ name, isActive: true }).lean();

const findActiveCategories = () =>
  Category.find({ isActive: true }).select("name description").sort({ name: 1 }).lean();

const createTicket = (ticketData) => Ticket.create(ticketData);

const findTicketByNumber = (ticketNumber) =>
  Ticket.findOne({ ticketNumber }).populate(ticketPopulation);

const findUserById = (userId) =>
  User.findById(userId).select("name email role isActive").lean();

const findUserByEmail = (email) =>
  User.findOne({ email: email.toLowerCase(), isActive: true })
    .select("name email role isActive")
    .lean();

// NEW: Find all active admin accounts for ticket notifications.
const findActiveAdmins = () =>
  User.find({
    role: "admin",
    isActive: true,
  })
    .select("name email role")
    .lean();

const createMessage = (data) => TicketMessage.create(data);

const findMessages = (filter) =>
  TicketMessage.find(filter)
    .populate("sender", "name email role")
    .sort({ createdAt: 1 })
    .lean();

const findMessageByEmailId = (emailMessageId) =>
  TicketMessage.findOne({ emailMessageId }).lean();

const createActivity = (data) => TicketActivity.create(data);

const findActivities = (filter) =>
  TicketActivity.find(filter)
    .populate("actor", "name email role")
    .sort({ createdAt: -1 })
    .lean();

const countTicketsByStatus = async (baseFilter) => {
  const statuses = [
    "open",
    "pending",
    "in_progress",
    "resolved",
    "closed",
    "reopened",
    "waiting_for_customer",
    "waiting_for_agent",
  ];

  const pairs = await Promise.all(
    statuses.map(async (status) => [
      status,
      await Ticket.countDocuments({ ...baseFilter, status }),
    ])
  );

  return Object.fromEntries(pairs);
};

const countHighPriorityTickets = (filter) =>
  Ticket.countDocuments({
    ...filter,
    priority: { $in: ["high", "urgent"] },
  });

const ticketRepository = {
  findTickets,
  countTickets,
  findTicketById,
  updateTicketById,
  findCategoryByName,
  findActiveCategories,
  createTicket,
  findTicketByNumber,
  findUserById,
  findUserByEmail,
  findActiveAdmins,
  createMessage,
  findMessages,
  findMessageByEmailId,
  createActivity,
  findActivities,
  countTicketsByStatus,
  countHighPriorityTickets,
};

export default ticketRepository;
