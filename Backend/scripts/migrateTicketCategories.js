import "dotenv/config";
import mongoose from "mongoose";
import Category from "../Src/Models/Category.js";
import Ticket from "../Src/Models/Ticket.js";

try {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing in .env");
  await mongoose.connect(process.env.MONGODB_URI);

  const categories = await Category.find({}).select("name").lean();
  const categoryNamesById = new Map(categories.map((category) => [category._id.toString(), category.name]));
  const oldTickets = await Ticket.collection.find({ category: { $type: "objectId" } }).toArray();

  let migrated = 0;
  let skipped = 0;
  for (const ticket of oldTickets) {
    const categoryName = categoryNamesById.get(ticket.category.toString());
    if (!categoryName) {
      skipped += 1;
      console.warn(`Skipped ticket ${ticket._id}: category document was not found.`);
      continue;
    }
    await Ticket.collection.updateOne({ _id: ticket._id }, { $set: { category: categoryName } });
    migrated += 1;
  }

  console.log(`Category migration complete. Migrated: ${migrated}; skipped: ${skipped}.`);
} catch (error) {
  console.error("Ticket category migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
