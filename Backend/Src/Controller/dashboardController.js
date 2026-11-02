import ticketService from "../Service/ticketService.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await ticketService.getDashboardSummary(req.user);
    return res.status(200).json({ success: true, message: "Dashboard summary fetched successfully.", data: summary });
  } catch (error) { next(error); }
};
