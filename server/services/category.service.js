import Category from "../models/Category.js";
import ApiError from "../utils/ApiError.js";

export const getAllCategories = async () => {
  const categories = await Category.find({
    isActive: true,
  }).sort({ name: 1 });

  return categories;
};



export const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (!category.isActive) {
    throw new ApiError(404, "Category is inactive");
  }

  return category;
};



export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({
    slug: slug.toLowerCase(),
    isActive: true,
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};