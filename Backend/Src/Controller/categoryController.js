import ticketService from "../Service/ticketService.js";

export const getCategories = async (_req, res, next) => {
  try {
    const categories = await ticketService.getCategories();
    return res.status(200).json({ success: true, message: "Categories fetched successfully.", data: { categories } });
  } catch (error) { next(error); }
};
