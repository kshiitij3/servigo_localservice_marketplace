import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
} from "../services/category.service.js";

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await getAllCategories();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Categories fetched successfully",
      categories
    )
  );
});

/**
 * @desc    Get category by ID
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
export const getCategory = asyncHandler(async (req, res) => {
  const category = await getCategoryById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Category fetched successfully",
      category
    )
  );
});

/**
 * @desc    Get category by slug
 * @route   GET /api/v1/categories/slug/:slug
 * @access  Public
 */
export const getCategoryUsingSlug = asyncHandler(async (req, res) => {
  const category = await getCategoryBySlug(req.params.slug);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Category fetched successfully",
      category
    )
  );
});