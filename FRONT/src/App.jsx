import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Categories from "./pages/Categories";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Suppliers from "./pages/Suppliers";

const App = () => {
  return (
    <Router>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Layout envuelve todas las páginas */}
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <div className="p-8">
                <h1 className="text-3xl font-bold">Home</h1>
              </div>
            }
          />
          <Route path="/categories" element={<Categories />} />
          {/* Agrega tus otras rutas aquí */}
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<Users />} />
          {/* <Route path="/clients" element={<Clients />} /> */}
          <Route path="/suppliers" element={<Suppliers />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
