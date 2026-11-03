import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import connectDB from "./Src/Config/Databse.js";
import authRouter from "./Src/Routes/authRoute.js";
import ticketRouter from "./Src/Routes/ticketRoutes.js";
import categoryRouter from "./Src/Routes/categoryRoutes.js";
import dashboardRouter from "./Src/Routes/dashboardRoutes.js";
import emailRouter from "./Src/Routes/emailRoutes.js";
import adminRouter from "./Src/Routes/adminRoutes.js";
import errorMiddleware from "./Src/Middleware/errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
}));

app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "Ticketing Email Support API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/email", emailRouter);
app.use("/api/admin", adminRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

export default app;

// Start the HTTP server only after MongoDB is connected.
const PORT = Number(process.env.PORT) || 5000;
if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
}
