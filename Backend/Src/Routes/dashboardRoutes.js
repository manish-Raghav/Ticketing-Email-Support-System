import express from "express";
import { getDashboardSummary } from "../Controller/dashboardController.js";
import { protect } from "../Middleware/authMiddileware.js";

const dashboardRouter = express.Router();
dashboardRouter.get("/summary", protect, getDashboardSummary);
export default dashboardRouter;
