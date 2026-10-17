import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT ?? 5000;

// ─── Local Development Only ───────────────────────────────────────────────────
// Vercel does not use this file. It imports `app` directly from app.ts.

// Attempt DB connection in the background — server starts immediately regardless
connectDB().catch((err) => {
  console.error("❌ Failed to connect to MongoDB on startup:", err);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
