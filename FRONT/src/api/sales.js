import api from "./api";

export const getAllSales = () => api.get("/sales");
export const getSaleById = (id) => api.get(`/sales/${id}`);
export const getSaleWithDetails = (id) => api.get(`/sales/${id}/details`);
export const registerSale = (data) => api.post("/sales/register", data);

// APIs auxiliares que necesitarás
export const getAllProducts = () => api.get("/products");
export const getAllClients = () => api.get("/clients");
export const getPresentationsByProduct = (id) =>
  api.get(`/presentations/product/${id}`);
