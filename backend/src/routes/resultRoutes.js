import express from "express";
import {
  getResults,
  getResultById,
  getResultsByStudent,
  getResultsByExam,
  getAdminDashboard,
  getTeacherDashboard,
  getStudentDashboard,
  publishResult,
  bulkPublishResults,
} from "../controllers/resultController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Dashboard routes (when mounted at /api/dashboard)
router.get("/admin", authorize("admin"), getAdminDashboard);
router.get("/teacher", authorize("teacher"), getTeacherDashboard);
router.get("/student", authorize("student"), getStudentDashboard);

// Result routes
router.get("/", authorize("admin", "teacher"), getResults);
router.get("/student/:studentId", getResultsByStudent);
router.get("/exam/:examId", authorize("admin", "teacher"), getResultsByExam);
router.put(
  "/exam/:examId/publish",
  authorize("admin", "teacher"),
  bulkPublishResults,
);
router.get("/:id", getResultById);
router.put("/:id/publish", authorize("admin", "teacher"), publishResult);

export default router;
