import { createContext, useContext, useState, useEffect } from "react";
import { verifyToken, logout as logoutApi } from "../api/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario logueado al cargar la app
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = verifyToken();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    logoutApi();
    setToken(null);
    setUser(null);
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!token && !!user;

  // Verificar si el usuario es admin
  const isAdmin = user?.rol === "admin";

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
