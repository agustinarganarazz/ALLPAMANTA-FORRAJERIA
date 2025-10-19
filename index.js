const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Routes.
const categoryRoutes = require("./routes/categoryRoutes");
const clientRoutes = require("./routes/clientRoute");

app.use("/categories", categoryRoutes);
app.use("/clients", clientRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
