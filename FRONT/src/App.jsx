import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Clients from "./pages/Client";
import Users from "./pages/Users";
import Suppliers from "./pages/Suppliers";
import Presentations from "./pages/Presentations";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Notificaciones */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: "#363636", color: "#fff" },
            success: {
              duration: 3000,
              iconTheme: { primary: "#22c55e", secondary: "#fff" },
            },
            error: {
              duration: 4000,
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />

        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/presentations"
              element={
                <ProtectedRoute>
                  <Presentations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute adminOnly>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suppliers"
              element={
                <ProtectedRoute>
                  <Suppliers />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
