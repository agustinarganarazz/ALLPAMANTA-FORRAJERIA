import api from "./api";

export const getAllPresentations = () => api.get("/presentations");
export const getPresentationsByProduct = (id_producto) =>
  api.get(`/presentations/product/${id_producto}`);
export const createPresentation = (data) => api.post("/presentations", data);
export const updatePresentation = (id, data) =>
  api.put(`/presentations/${id}`, data);
export const deletePresentation = (id) => api.delete(`/presentations/${id}`);
