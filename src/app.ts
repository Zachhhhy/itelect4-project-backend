import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import submissionRoutes from "./routes/submissionRoutes";

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(express.json());

// Ensure DB is connected on every serverless request (cached — no new connection opened)
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({ success: true, message: "ITELECT4 API is running." });
});

// ─── Vercel Entry Point ───────────────────────────────────────────────────────

export default app;
