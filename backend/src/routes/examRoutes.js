import express from "express";
import { body } from "express-validator";
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  submitExam,
  getAvailableExams,
} from "../controllers/examController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

// Validation rules
const examValidation = [
  body("title").trim().notEmpty().withMessage("Exam title is required"),
  body("courseId").notEmpty().withMessage("Course ID is required"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive number"),
  body("totalMarks")
    .isInt({ min: 1 })
    .withMessage("Total marks must be a positive number"),
  body("passingMarks")
    .isInt({ min: 0 })
    .withMessage("Passing marks must be a non-negative number"),
  body("startTime").isISO8601().withMessage("Valid start time is required"),
  body("endTime").isISO8601().withMessage("Valid end time is required"),
];

const submitExamValidation = [
  body("answers").isObject().withMessage("Answers must be an object"),
];

router.use(protect);

router.get("/available", authorize("student"), getAvailableExams);

router
  .route("/")
  .get(getExams)
  .post(
    authorize("admin", "teacher"),
    examValidation,
    validateRequest,
    createExam,
  );

router
  .route("/:id")
  .get(getExamById)
  .put(authorize("admin", "teacher"), updateExam)
  .delete(authorize("admin", "teacher"), deleteExam);

router.post(
  "/:id/submit",
  authorize("student"),
  submitExamValidation,
  validateRequest,
  submitExam,
);

export default router;
