import express from "express";

import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  updateMyPassword,
} from "../controllers/auth.controller.js";

import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  validate,
} from "../validations/auth.validation.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post(
  "/register",
  registerValidation,
  validate,
  register
);

router.post(
  "/login",
  loginValidation,
  validate,
  login
);

// Protected Routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfileValidation, validate, updateMe);
router.patch("/change-password", protect, changePasswordValidation, validate, updateMyPassword);

export default router;
