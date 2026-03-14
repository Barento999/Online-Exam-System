import express from "express";
import { body } from "express-validator";
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  bulkCreateQuestions,
  uploadQuestionsFile,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { upload } from "../config/upload.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, "../../uploads/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer for file uploads (CSV/Excel)
const fileUpload = multer({
  dest: tempDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /csv|xlsx|xls/;
    const extname = allowedTypes.test(
      file.originalname.toLowerCase().split(".").pop(),
    );
    const mimetype =
      file.mimetype === "text/csv" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel";

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel files are allowed"));
    }
  },
});

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
    upload.single("image"),
    questionValidation,
    validateRequest,
    createQuestion,
  );

// IMPORTANT: Specific routes must come before parameterized routes
router.post(
  "/bulk",
  authorize("admin", "teacher"),
  bulkQuestionValidation,
  validateRequest,
  bulkCreateQuestions,
);

router.post(
  "/upload",
  authorize("admin", "teacher"),
  fileUpload.single("file"),
  uploadQuestionsFile,
);

// Parameterized routes come last
router
  .route("/:id")
  .get(getQuestionById)
  .put(authorize("admin", "teacher"), upload.single("image"), updateQuestion)
  .delete(authorize("admin", "teacher"), deleteQuestion);

export default router;
