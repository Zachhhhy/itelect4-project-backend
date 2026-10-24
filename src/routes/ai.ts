import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { ApiError } from "@google/genai";
import { requireAuth } from "../middleware/auth";
import { aiRequestSchema } from "../schemas/aiSchema";
import { reviewProject, AiReplyError } from "../ai/gemini";

const aiRouter = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  keyGenerator: (req) => req.user!.id,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "AI review limit reached. Please wait a minute and try again." },
});

aiRouter.use(requireAuth, aiLimiter);

aiRouter.post("/", async (req, res, next) => {
  const parsed = aiRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues.map((issue) => issue.message),
    });
    return;
  }

  try {
    res.json(await reviewProject(parsed.data.prompt));
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof ApiError && error.status === 429) {
      res.status(429).json({ message: "Gemini quota is temporarily unavailable. Please try again later." });
      return;
    }
    if (error instanceof AiReplyError || error instanceof ApiError) {
      res.status(502).json({ message: "The AI review service returned an unusable response." });
      return;
    }
    next(error);
  }
});

export default aiRouter;
