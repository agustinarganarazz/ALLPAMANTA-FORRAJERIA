import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    logout(); // limpia token y usuario
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/products", label: "Productos" },
    { path: "/categories", label: "Categorías" },
    { path: "/clients", label: "Clientes" },
    { path: "/suppliers", label: "Proveedores" },
    { path: "/users", label: "Usuarios" },
    { path: "/presentations", label: "Presentaciones" },
    ...(!isLoggedIn ? [{ path: "/login", label: "Login" }] : []),
  ];

  const moreLinks = [
    { path: "/sales", label: "Ventas" },
    { path: "/purchases", label: "Compras" },
    { path: "/reports", label: "Reportes" },
  ];

  return (
    <nav className="fixed w-full z-50 top-0">
      <div className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Forrajería
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-slate-700 text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Dropdown Menu */}
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center space-x-1">
                  <span>Más</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
                  <div className="backdrop-blur-md bg-slate-900/95 rounded-lg shadow-xl border border-slate-700/50 py-2 overflow-hidden">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-4 py-2.5 font-medium transition-colors ${
                          isActive(link.path)
                            ? "bg-slate-700 text-white"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Menu */}
              <div className="ml-4 flex items-center space-x-3 pl-4 border-l border-slate-700">
                <button className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        U
                      </span>
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
                    <div className="backdrop-blur-md bg-slate-900/95 rounded-lg shadow-xl border border-slate-700/50 py-2 overflow-hidden">
                      <Link
                        to="/profile"
                        className="block px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-colors"
                      >
                        Mi Perfil
                      </Link>

                      <hr className="border-slate-700/50 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-slate-800/50 font-medium transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 focus:outline-none transition-all duration-200"
              >
                {menuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-700/50">
            <div className="backdrop-blur-md bg-slate-900/95 px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 pb-1 border-t border-slate-700/50 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Más opciones
                </p>
                {moreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(link.path)
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-700/50 mt-2">
                <Link
                  to="/profile"
                  className="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-800/50 font-medium transition-all duration-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
