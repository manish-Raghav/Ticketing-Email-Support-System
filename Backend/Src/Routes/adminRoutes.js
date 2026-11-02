import express from "express";
import { protect } from "../Middleware/authMiddileware.js";
import authorizeRoles from "../Middleware/roleMiddileware.js";
import { getUsers, getAgents, updateUserStatus } from "../Controller/adminController.js";

const router = express.Router();
router.use(protect, authorizeRoles("admin"));
router.get("/users", getUsers);
router.get("/agents", getAgents);
router.patch("/users/:userId/status", updateUserStatus);
export default router;
