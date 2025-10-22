const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const NODE_ENV = process.env.NODE_ENV || "development";
const FRONTEND_URL = process.env.FRONTEND_URL;

//Middlewares.
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "API REST - Gestión de Inventario",
    version: "1.0.0",
    endpoints: {
      categories: "/api/categories",
      clients: "/api/clients",
      suppliers: "/api/suppliers",
      users: "/api/users",
      products: "/api/products",
      auth: "/api/auth",
      presentations: "/api/presentations",
      purchases: "/api/purchases",
      sales: "/api/sales",
    },
  });
});

//Routes.
const categoryRoute = require("./routes/categoryRoute");
const clientRoutes = require("./routes/clientRoute");
const supplierRoute = require("./routes/supplierRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const presentationRoute = require("./routes/presentationRoute");
const purchaseRoute = require("./routes/purschasesRoute");
const purchasesDetailRoute = require("./routes/purchaseDetailRoute");
const salesRoute = require("./routes/salesRoute");
const salesDetailRoute = require("./routes/salesDetailRoute");
const registerSaleRoute = require("./routes/registerSaleRoute");


app.use("/api/categories", categoryRoute);
app.use("/api/clients", clientRoutes);
app.use("/api/suppliers", supplierRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/presentations", presentationRoute);
app.use("/api/purchases", purchaseRoute);
app.use("/api/purchases-details", purchasesDetailRoute);
app.use("/api/sales", salesRoute);
app.use("/api/sales-details", salesDetailRoute);
app.use("/api/register-sale", registerSaleRoute);

// ========================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ========================================
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Endpoint no encontrado",
    path: req.path,
    method: req.method,
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    ok: false,
    message: "Internal server error",
    error: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 Servidor iniciado correctamente");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🎨 Frontend: ${FRONTEND_URL}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});

module.exports = app;
