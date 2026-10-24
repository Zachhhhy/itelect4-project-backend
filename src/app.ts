import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import courseRouter from "./routes/courses";
import aiRouter from "./routes/ai";

dotenv.config();

export const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin !== "");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server, postman)
      // or if allowedOrigins is not set / empty, or contains origin / wildcard
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ─── Database Middleware (Cached for serverless) ──────────────────────────────

app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

// ─── Health Checks ────────────────────────────────────────────────────────────

app.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "ITELECT4 API is running." });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 });
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/courses", courseRouter);
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRouter);

// ─── 404 & Error Handler ──────────────────────────────────────────────────────

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `No route for ${req.method} ${req.originalUrl}`,
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      message: `"${err.value}" is not a valid id`,
    });
    return;
  }

  res.status(500).json({ message: err.message || "Something went wrong" });
});

// ─── Vercel Entry Point ───────────────────────────────────────────────────────

export default app;
