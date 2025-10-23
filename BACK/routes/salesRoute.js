const express = require("express");
const router = express.Router();
const { getAllSales, getSaleById } = require("../controllers/sales");

const {
  registerSale,
  getSaleWithDetails,
} = require("../controllers/registerSale");

// Rutas
router.get("/", getAllSales); // Obtener todas las ventas
router.get("/:id", getSaleById); // Obtener venta por ID
router.get("/:id/details", getSaleWithDetails); // Obtener venta con detalles
router.post("/register", registerSale); // Registrar venta completa

module.exports = router;
