import api from "./api";

export const getAllCategories = () => api.get("/categories");
export const getInactiveCategories = () => api.get("/categories/inactive");
export const createCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const activateCategory = (id) => api.put(`/categories/${id}/activate`);
export const deactivateCategory = (id) =>
  api.put(`/categories/${id}/deactivate`);
