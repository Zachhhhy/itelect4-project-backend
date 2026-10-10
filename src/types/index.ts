import { Document } from "mongoose";

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  role: "student" | "admin" | "instructor";
  isActive: boolean;
  password: string;
}

export interface IUserDocument extends IUser, Document {}

// ─── Submission ───────────────────────────────────────────────────────────────

export type SubmissionStatus = "pending" | "submitted" | "graded" | "late";

export interface ISubmission {
  studentId: string;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
  status: SubmissionStatus;
  score?: number;
}

export interface ISubmissionDocument extends ISubmission, Document {}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: string;
  role: string;
}

// Extend Express Request to carry the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
