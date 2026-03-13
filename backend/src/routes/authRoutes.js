import express from "express";
import { body } from "express-validator";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["student", "teacher", "admin"])
    .withMessage("Invalid role"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
