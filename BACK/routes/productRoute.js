const { Router } = require("express");
const router = Router();

const {
  getAllProducts,
  getProductsInactive,
  createProduct,
  updateProduct,
  activeProduct,
  inactiveProduct,
} = require("../controllers/products");

// Rutas principales
router.get("/", getAllProducts); // GET /products
router.get("/inactive", getProductsInactive); // GET /products/inactive
router.post("/", createProduct); // POST /products
router.put("/:id", updateProduct); // PUT /products/:id
router.put("/:id/deactivate", inactiveProduct); // PUT /products/:id/deactivate
router.put("/:id/activate", activeProduct); // PUT /products/:id/activate

module.exports = router;
