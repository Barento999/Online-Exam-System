import express from "express";
import { body } from "express-validator";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

// Validation rules for creating courses
const createCourseValidation = [
  body("name").trim().notEmpty().withMessage("Course name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required"),
  body("teacherId").optional(), // Optional - teachers auto-assigned to themselves
];

// Validation rules for updating courses (admin can change teacherId)
const updateCourseValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Course name cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Course description cannot be empty"),
  body("teacherId").optional(),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

router.use(protect);

router
  .route("/")
  .get(getCourses)
  .post(
    authorize("admin", "teacher"),
    createCourseValidation,
    validateRequest,
    createCourse,
  );

router
  .route("/:id")
  .get(getCourseById)
  .put(
    authorize("admin", "teacher"),
    updateCourseValidation,
    validateRequest,
    updateCourse,
  )
  .delete(authorize("admin"), deleteCourse);

export default router;
