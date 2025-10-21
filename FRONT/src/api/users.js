import api from "./api";

export const getAllUsers = () => api.get("/users");
export const getInactiveUsers = () => api.get("/users/inactive");
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const activateUser = (id) => api.put(`/users/${id}/activate`);
export const deactivateUser = (id) => api.put(`/users/${id}/deactivate`);
