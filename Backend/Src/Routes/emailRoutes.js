import express from "express";
import { receiveInboundEmail } from "../Controller/emailController.js";
import inboundEmailAuth from "../Middleware/inboundEmailAuth.js";

const emailRouter = express.Router();
emailRouter.post("/inbound", inboundEmailAuth, receiveInboundEmail);
export default emailRouter;
