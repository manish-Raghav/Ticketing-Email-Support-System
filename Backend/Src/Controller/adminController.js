import mongoose from "mongoose";
import userRepository from "../Repository/userRepository.js";

const list = async (req, res, role) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
  const result = await userRepository.listUsers({ role, search: req.query.search || "", page, limit });
  return res.status(200).json({ success: true, message: "Users fetched successfully.", data: result });
};

export const getUsers = async (req, res, next) => {
  try { return await list(req, res, req.query.role || null); }
  catch (error) { return next(error); }
};

export const getAgents = async (req, res, next) => {
  try { return await list(req, res, "support_agent"); }
  catch (error) { return next(error); }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ success: false, message: "isActive must be true or false." });
    }
    if (String(req.user._id) === userId && !isActive) {
      return res.status(400).json({ success: false, message: "You cannot deactivate your own account." });
    }
    const user = await userRepository.updateActiveStatus(userId, isActive);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, message: `User ${isActive ? "activated" : "deactivated"} successfully.`, data: { user } });
  } catch (error) { return next(error); }
};
