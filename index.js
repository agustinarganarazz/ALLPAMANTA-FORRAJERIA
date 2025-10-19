const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Routes.
const categoryRoute = require("./routes/categoryRoutes");
const clientRoutes = require("./routes/clientRoute");
const supplierRoute = require("./routes/supplierRoute");
const userRoute = require("./routes/userRoute");

app.use("/categories", categoryRoute);
app.use("/clients", clientRoutes);
app.use("/supplier", supplierRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
