import "dotenv/config";
import mongoose from "mongoose";
import Category from "../Src/Models/Category.js";

const defaultCategories = [
  { name: "Technical Support", description: "Technical issues and troubleshooting" },
  { name: "Billing", description: "Payments, invoices and refunds" },
  { name: "Account", description: "Account access and profile issues" },
  { name: "General Inquiry", description: "General questions and requests" },
];

try {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing in .env");
  await mongoose.connect(process.env.MONGODB_URI);
  for (const category of defaultCategories) {
    await Category.updateOne(
      { name: category.name },
      { $setOnInsert: category },
      { upsert: true }
    );
  }
  console.log("Default ticket categories are ready.");
} catch (error) {
  console.error("Category seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
