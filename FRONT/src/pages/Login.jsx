import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { login } from "../api/auth";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await login(credentials);

      if (response.data.ok) {
        // Guardar token y usuario en el contexto
        loginContext(response.data.token, response.data.user);

        toast.success(`¡Bienvenido ${response.data.user.nombre}!`);

        // Redirigir según el rol
        if (response.data.user.rol === "admin") {
          navigate("/categories");
        } else {
          navigate("/sales");
        }
      } else {
        toast.error(response.data.msg || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en login:", error);
      const message =
        error.response?.data?.msg ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo o título del sistema */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">SV</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema de Ventas
          </h1>
          <p className="text-slate-300">
            Gestiona tu negocio de forma eficiente
          </p>
        </div>

        {/* Formulario de Login */}
        <LoginForm onSubmit={handleLogin} loading={loading} />

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>© 2025 Sistema de Ventas. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
