import { body, validationResult } from "express-validator";
import ApiResponse from "../utils/ApiResponse.js";

//register validatiion
export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("phone")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid Indian mobile number"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),

  body("role")
    .isIn(["customer", "professional"])
    .withMessage("Role must be customer or professional"),
];

//login validation
export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

//validation result handler

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(
      new ApiResponse(400, "Validation failed", {
        errors: errors.array(),
      })
    );
  }

  next();
};