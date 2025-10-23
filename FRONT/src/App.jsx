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
import Sales from "./pages/Sales";
import NewSale from "./components/NewSale";
import SaleDetail from "./components/SaleDetail";
import Purchases from "./pages/Purchases";
import PurchaseDetail from "./components/PurchaseDetail";
import NewPurchase from "./components/NewPurchase";

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
            <Route path="/sales/:id" element={<SaleDetail />} />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/new"
              element={
                <ProtectedRoute>
                  <NewSale />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales/:id"
              element={
                <ProtectedRoute>
                  <SaleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute>
                  <Purchases />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases/new"
              element={
                <ProtectedRoute>
                  <NewPurchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases/:id"
              element={
                <ProtectedRoute>
                  <PurchaseDetail />
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
