import api from "./api";

export const getAllPurchases = () => api.get("/purchases");
export const getPurchaseById = (id) => api.get(`/purchases/${id}`);
export const getPurchaseWithDetails = (id) =>
  api.get(`/purchases/${id}/details`);
export const registerPurchase = (data) => api.post("/purchases/register", data);

// APIs auxiliares
export const getAllProducts = () => api.get("/products");
export const getAllSuppliers = () => api.get("/suppliers");
