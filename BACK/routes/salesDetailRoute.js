const express = require("express");
const router = express.Router();
const {
  getAllDetalleVentas,
  getDetalleVentaById,
} = require("../controllers/salesDetail");

// Obtener todos los detalles de ventas
router.get("/", getAllDetalleVentas);

// Obtener un detalle de venta por id
router.get("/:id", getDetalleVentaById);

module.exports = router;
