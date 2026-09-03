import api from "./api";

export const getCategories = async () => {
  return await api.get("/categories");
};

export const getCategoryById = async (id) => {
  return await api.get(`/categories/${id}`);
};

export const getCategoryBySlug = async (slug) => {
  return await api.get(`/categories/slug/${slug}`);
};
