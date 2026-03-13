import express from "express";
import { body } from "express-validator";
import {
  enrollStudent,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
  getMyEnrolledCourses,
} from "../controllers/enrollmentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

// Validation rules
const enrollmentValidation = [
  body("studentId").notEmpty().withMessage("Student ID is required"),
  body("courseId").notEmpty().withMessage("Course ID is required"),
];

const updateEnrollmentValidation = [
  body("status")
    .optional()
    .isIn(["active", "completed", "dropped"])
    .withMessage("Invalid status"),
];

router.use(protect);

// Student's enrolled courses
router.get("/my-courses", authorize("student"), getMyEnrolledCourses);

router
  .route("/")
  .get(getEnrollments)
  .post(
    authorize("admin", "teacher"),
    enrollmentValidation,
    validateRequest,
    enrollStudent,
  );

router
  .route("/:id")
  .get(getEnrollmentById)
  .put(
    authorize("admin", "teacher"),
    updateEnrollmentValidation,
    validateRequest,
    updateEnrollment,
  )
  .delete(authorize("admin", "teacher"), deleteEnrollment);

export default router;
