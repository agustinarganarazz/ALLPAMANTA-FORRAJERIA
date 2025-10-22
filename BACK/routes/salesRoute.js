const express = require("express");
const router = express.Router();
const { getAllSales, getSaleById } = require("../controllers/sales");

// Rutas
router.get("/", getAllSales); // Obtener todas las ventas
router.get("/:id", getSaleById); // Obtener venta por ID

module.exports = router;
