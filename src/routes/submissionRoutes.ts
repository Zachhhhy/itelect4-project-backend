import { Router } from "express";
import { protect } from "../middleware/auth";
import {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
} from "../controllers/submissionController";

const router = Router();

// All routes below are protected by JWT guard
router.use(protect);

// GET    /api/submissions
router.get("/", getAllSubmissions);

// GET    /api/submissions/:id
router.get("/:id", getSubmissionById);

// POST   /api/submissions
router.post("/", createSubmission);

// PUT    /api/submissions/:id
router.put("/:id", updateSubmission);

// DELETE /api/submissions/:id
router.delete("/:id", deleteSubmission);

export default router;
