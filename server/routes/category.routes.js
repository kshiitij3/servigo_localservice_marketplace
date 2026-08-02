import express from "express";

import {
  getCategories,
  getCategory,
  getCategoryUsingSlug,
} from "../controllers/category.controller.js";

import {
  getCategoryByIdValidation,
  validate,
} from "../validations/category.validation.js";

const router = express.Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get("/", getCategories);

/**
 * @route   GET /api/v1/categories/slug/:slug
 * @desc    Get category by slug
 * @access  Public
 *
 * IMPORTANT:
 * Keep this ABOVE "/:id"
 */
router.get(
  "/slug/:slug",
  getCategoryUsingSlug
);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get category by id
 * @access  Public
 */
router.get(
  "/:id",
  getCategoryByIdValidation,
  validate,
  getCategory
);

export default router;