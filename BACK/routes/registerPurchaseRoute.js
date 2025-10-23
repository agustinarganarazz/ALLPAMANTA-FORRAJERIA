const express = require("express");
const router = express.Router();

// Controladores de compras
const {
  getAllPurchases,
  getPurchaseById,
} = require("../controllers/purchases");

const {
  registerPurchase,
  getPurchaseWithDetails,
} = require("../controllers/registerPurchase");

// Rutas
router.get("/", getAllPurchases); // Obtener todas las compras
router.get("/:id", getPurchaseById); // Obtener compra por ID
router.get("/:id/details", getPurchaseWithDetails); // Obtener compra con detalles
router.post("/register", registerPurchase); // Registrar compra completa

module.exports = router;
