import api from "./api";

export const getAllProducts = () => api.get("/products");
export const getInactiveProducts = () => api.get("/products/inactive");
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const activateProduct = (id) => api.put(`/products/${id}/activate`);
export const deactivateProduct = (id) => api.put(`/products/${id}/deactivate`);
