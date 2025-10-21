import api from "./api";

export const getAllSuppliers = () => api.get("/suppliers");
export const getInactiveSuppliers = () => api.get("/suppliers/inactive");
export const createSupplier = (data) => api.post("/suppliers", data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const activateSupplier = (id) => api.put(`/suppliers/${id}/activate`);
export const deactivateSupplier = (id) =>
  api.put(`/suppliers/${id}/deactivate`);
