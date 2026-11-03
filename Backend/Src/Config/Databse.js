
import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = async () => {
  try {
    // Reuse an existing MongoDB connection
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    // Reuse an ongoing connection attempt
    if (!connectionPromise) {
      connectionPromise = mongoose.connect(process.env.MONGODB_URI);
    }

    const connection = await connectionPromise;

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    return connection.connection;

  } catch (error) {
    connectionPromise = null;

    console.error("MongoDB Error:", error.message);
    throw error;
  }
};

export default connectDB;
