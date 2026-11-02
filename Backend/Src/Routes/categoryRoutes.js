import express from "express";
import { getCategories } from "../Controller/categoryController.js";
import { protect } from "../Middleware/authMiddileware.js";

const categoryRouter = express.Router();
categoryRouter.get("/", protect, getCategories);
export default categoryRouter;
