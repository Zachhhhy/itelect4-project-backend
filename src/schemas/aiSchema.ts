import { z } from "zod";

export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe your project in at least 20 characters.")
    .max(2000, "Keep your project description to 2000 characters or fewer."),
});

export const reviewSchema = z.object({
  summary: z.string().min(1).describe("A concise summary of the project and its current state."),
  strengths: z
    .array(z.string().min(1))
    .min(1)
    .max(3)
    .describe("One to three specific strengths of the project."),
  improvements: z
    .array(z.string().min(1))
    .min(1)
    .max(3)
    .describe("One to three specific, practical improvements."),
  readiness: z
    .enum(["ready", "almost", "not-yet"])
    .describe("Whether the project is ready, almost ready, or not yet ready."),
});

export type Review = z.infer<typeof reviewSchema>;
