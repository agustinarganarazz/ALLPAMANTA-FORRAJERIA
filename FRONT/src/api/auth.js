import api from "./api";

// Login
export const login = (credentials) => api.post("/auth/login", credentials);

// Register
export const register = (userData) => api.post("/auth/register", userData);

// Verificar si hay un token y usuario válido
export const verifyToken = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    return null;
  }
};

// Logout (limpia localStorage)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
