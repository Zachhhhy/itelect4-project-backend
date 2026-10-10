import { Schema, model } from "mongoose";
import { ISubmissionDocument } from "../types";

const submissionSchema = new Schema<ISubmissionDocument>(
  {
    studentId: { type: String, required: true },
    courseCode: { type: String, required: true, trim: true, uppercase: true },
    repoUrl: { type: String, required: true, trim: true },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "submitted", "graded", "late"],
      default: "submitted",
    },
    score: { type: Number, min: 0, max: 100 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Submission = model<ISubmissionDocument>(
  "Submission",
  submissionSchema
);
