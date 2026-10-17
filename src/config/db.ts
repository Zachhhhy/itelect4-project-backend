import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

// Cached connection promise — reused across serverless invocations
let connection: Promise<typeof mongoose> | null = null;

export const connectDB = (): Promise<typeof mongoose> => {
  if (connection === null) {
    connection = mongoose
      .connect(MONGO_URI)
      .then((mongooseInstance) => {
        console.log("✅ Connected to MongoDB");
        return mongooseInstance;
      })
      .catch((err) => {
        // Reset so the next request can retry
        connection = null;
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  return connection;
};
