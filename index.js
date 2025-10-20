const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    ok: false,
    message: "Internal server error",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
