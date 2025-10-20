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

app.use("/categories", categoryRoute);
app.use("/clients", clientRoutes);
app.use("/suppliers", supplierRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/auth", authRoute);
app.use("/presentations", presentationRoute);
app.use("/purchases", purchaseRoute);
app.use("/purchasesDetail", purchasesDetailRoute);
app.use("/sales", salesRoute);
app.use("/salesDetail", salesDetailRoute);

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
