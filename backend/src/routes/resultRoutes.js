import express from "express";
import {
  getResults,
  getResultById,
  getResultsByStudent,
  getResultsByExam,
  getAdminDashboard,
  getTeacherDashboard,
  getStudentDashboard,
} from "../controllers/resultController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Dashboard routes
router.get("/dashboard/admin", authorize("admin"), getAdminDashboard);
router.get("/dashboard/teacher", authorize("teacher"), getTeacherDashboard);
router.get("/dashboard/student", authorize("student"), getStudentDashboard);

// Result routes
router.get("/", authorize("admin", "teacher"), getResults);
router.get("/student/:studentId", getResultsByStudent);
router.get("/exam/:examId", authorize("admin", "teacher"), getResultsByExam);
router.get("/:id", getResultById);

export default router;
