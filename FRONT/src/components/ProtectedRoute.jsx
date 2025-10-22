import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Mostrar loader mientras verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // No autenticado - redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Requiere admin pero no lo es - redirigir
  if (adminOnly && !isAdmin) {
    return <Navigate to="/sales" replace />;
  }

  return children;
};

export default ProtectedRoute;
