import express from "express";
import { body } from "express-validator";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  exportUsers,
  importUsers,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temp directory for uploads
const tempDir = path.join(__dirname, "../../uploads/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer for CSV uploads
const csvUpload = multer({
  dest: tempDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.toLowerCase().split(".").pop();
    const allowedExts = ["csv", "xlsx", "xls"];

    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel files are allowed"));
    }
  },
});

const router = express.Router();

// Validation rules
const createUserValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["student", "teacher", "admin"])
    .withMessage("Invalid role"),
];

const updateUserValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("role")
    .optional()
    .isIn(["student", "teacher", "admin"])
    .withMessage("Invalid role"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

router.use(protect);

// Export/Import routes (must come before /:id route)
router.get("/export/csv", authorize("admin"), exportUsers);
router.post(
  "/import/csv",
  authorize("admin"),
  csvUpload.single("file"),
  importUsers,
);

router
  .route("/")
  .get(authorize("admin"), getUsers)
  .post(authorize("admin"), createUserValidation, validateRequest, createUser);

router
  .route("/:id")
  .get(getUserById)
  .put(authorize("admin"), updateUserValidation, validateRequest, updateUser)
  .delete(authorize("admin"), deleteUser);

export default router;
