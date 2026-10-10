import { Request, Response } from "express";
import { Submission } from "../models/Submission";

// ─── GET /api/submissions ─────────────────────────────────────────────────────

export async function getAllSubmissions(req: Request, res: Response): Promise<void> {
  try {
    const submissions = await Submission.find();
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
}

// ─── GET /api/submissions/:id ─────────────────────────────────────────────────

export async function getSubmissionById(req: Request, res: Response): Promise<void> {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found." });
      return;
    }

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
}

// ─── POST /api/submissions ────────────────────────────────────────────────────

export async function createSubmission(req: Request, res: Response): Promise<void> {
  try {
    const { studentId, courseCode, repoUrl, status, score } = req.body;

    const submission = await Submission.create({
      studentId,
      courseCode,
      repoUrl,
      submittedAt: new Date(),
      status: status ?? "submitted",
      score,
    });

    res.status(201).json({ success: true, message: "Submission created.", data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
}

// ─── PUT /api/submissions/:id ─────────────────────────────────────────────────

export async function updateSubmission(req: Request, res: Response): Promise<void> {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found." });
      return;
    }

    res.status(200).json({ success: true, message: "Submission updated.", data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
}

// ─── DELETE /api/submissions/:id ──────────────────────────────────────────────

export async function deleteSubmission(req: Request, res: Response): Promise<void> {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);

    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found." });
      return;
    }

    res.status(200).json({ success: true, message: "Submission deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error });
  }
}
