import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import submissionRoutes from "./routes/submissionRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;
const MONGO_URI = process.env.MONGO_URI as string;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({ success: true, message: "ITELECT4 API is running." });
});

// ─── Database + Server Start ──────────────────────────────────────────────────

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
