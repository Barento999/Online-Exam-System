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

// Validation rules
const courseValidation = [
  body("name").trim().notEmpty().withMessage("Course name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required"),
  body("teacherId").notEmpty().withMessage("Teacher ID is required"),
];

router.use(protect);

router
  .route("/")
  .get(getCourses)
  .post(
    authorize("admin", "teacher"),
    courseValidation,
    validateRequest,
    createCourse,
  );

router
  .route("/:id")
  .get(getCourseById)
  .put(authorize("admin", "teacher"), updateCourse)
  .delete(authorize("admin"), deleteCourse);

export default router;
