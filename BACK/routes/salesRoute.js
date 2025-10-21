const express = require("express");
const router = express.Router();
const {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} = require("../controllers/sales");

// Rutas
router.get("/", getAllSales); // Obtener todas las ventas
router.get("/:id", getSaleById); // Obtener venta por ID
router.post("/", createSale); // Crear nueva venta
router.put("/:id", updateSale); // Actualizar venta
router.delete("/:id", deleteSale); // Eliminar venta

module.exports = router;
