import express from "express";
import { body } from "express-validator";
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  bulkCreateQuestions,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

// Validation rules
const questionValidation = [
  body("examId").notEmpty().withMessage("Exam ID is required"),
  body("questionText")
    .trim()
    .notEmpty()
    .withMessage("Question text is required"),
  body("optionA").trim().notEmpty().withMessage("Option A is required"),
  body("optionB").trim().notEmpty().withMessage("Option B is required"),
  body("optionC").trim().notEmpty().withMessage("Option C is required"),
  body("optionD").trim().notEmpty().withMessage("Option D is required"),
  body("correctAnswer")
    .isIn(["A", "B", "C", "D"])
    .withMessage("Correct answer must be A, B, C, or D"),
  body("marks")
    .isInt({ min: 1 })
    .withMessage("Marks must be a positive number"),
];

const bulkQuestionValidation = [
  body("examId").notEmpty().withMessage("Exam ID is required"),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("Questions must be a non-empty array"),
];

router.use(protect);

router
  .route("/")
  .get(getQuestions) // All authenticated users can get questions (with restrictions in controller)
  .post(
    authorize("admin", "teacher"),
    questionValidation,
    validateRequest,
    createQuestion,
  );

router.post(
  "/bulk",
  authorize("admin", "teacher"),
  bulkQuestionValidation,
  validateRequest,
  bulkCreateQuestions,
);

router
  .route("/:id")
  .get(getQuestionById)
  .put(authorize("admin", "teacher"), updateQuestion)
  .delete(authorize("admin", "teacher"), deleteQuestion);

export default router;
