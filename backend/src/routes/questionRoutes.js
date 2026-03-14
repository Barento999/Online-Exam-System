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
    console.log("File filter - mimetype:", file.mimetype);
    console.log("File filter - originalname:", file.originalname);

    const ext = file.originalname.toLowerCase().split(".").pop();
    const allowedExts = ["csv", "xlsx", "xls"];
    const allowedMimes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/csv",
      "text/x-csv",
      "application/x-csv",
      "text/comma-separated-values",
      "text/x-comma-separated-values",
    ];

    if (allowedExts.includes(ext) || allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Only CSV and Excel files are allowed. Got: ${file.mimetype}`,
        ),
      );
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
  (req, res, next) => {
    console.log("=== Upload route hit (before multer) ===");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body before multer:", req.body);

    fileUpload.single("file")(req, res, (err) => {
      if (err) {
        console.error("=== Multer error ===");
        console.error("Error:", err);
        console.error("Error message:", err.message);
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ message: "File size exceeds 10MB limit" });
          }
          return res
            .status(400)
            .json({ message: `Upload error: ${err.message}` });
        }
        return res.status(400).json({ message: err.message });
      }
      console.log("=== Multer processed successfully ===");
      console.log("File received:", req.file ? "YES" : "NO");
      console.log("Body after multer:", req.body);
      if (req.file) {
        console.log("File details:", {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        });
      }
      next();
    });
  },
  uploadQuestionsFile,
);

// Parameterized routes come last
router
  .route("/:id")
  .get(getQuestionById)
  .put(authorize("admin", "teacher"), upload.single("image"), updateQuestion)
  .delete(authorize("admin", "teacher"), deleteQuestion);

export default router;
