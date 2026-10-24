import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { reviewSchema, type Review } from "../schemas/aiSchema";
import { buildContents, SYSTEM_PROMPT } from "./prompt";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on the backend.");
  return (client ??= new GoogleGenAI({ apiKey }));
}

export class AiReplyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiReplyError";
  }
}

export async function reviewProject(prompt: string): Promise<Review> {
  const response = await getClient().models.generateContent({
    model: "gemini-flash-latest",
    contents: buildContents(prompt),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(reviewSchema),
    },
  });

  const text = response.text;
  if (!text) throw new AiReplyError("Gemini returned an empty review.");

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AiReplyError("Gemini returned invalid JSON.");
  }

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) throw new AiReplyError("Gemini returned an invalid review shape.");
  return parsed.data;
}
