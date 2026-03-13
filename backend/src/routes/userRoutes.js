import express from "express";
import { body } from "express-validator";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";

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
