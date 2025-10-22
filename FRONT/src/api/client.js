import api from "./api";

export const getAllClients = () => api.get("/clients");
export const getInactiveClients = () => api.get("/clients/inactive");
export const createClient = (data) => api.post("/clients", data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const activateClient = (id) => api.put(`/clients/${id}/activate`);
export const deactivateClient = (id) => api.put(`/clients/${id}/deactivate`);

