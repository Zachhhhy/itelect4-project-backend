import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../src/config/db", () => ({ connectDB: async () => {} }));
process.env.JWT_SECRET ||= "test-secret";

import app from "../src/app";

function tokenFor(userId: string): string {
  return jwt.sign({ id: userId, role: "student" }, process.env.JWT_SECRET!, { expiresIn: "5m" });
}

describe("POST /api/ai", () => {
  it("returns 401 when there is no token", async () => {
    const response = await request(app)
      .post("/api/ai")
      .send({ prompt: "A course submission tracker in React." });
    expect(response.status).toBe(401);
  });

  it("lets a valid token reach route validation without calling Gemini", async () => {
    const response = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${tokenFor("test-user")}`)
      .send({ prompt: "Too short" });
    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(["Describe your project in at least 20 characters."]);
  });
});
