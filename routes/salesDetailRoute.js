const express = require("express");
const router = express.Router();
const {
  getAllDetalleVentas,
  getDetalleVentaById,
  createDetalleVenta,
  updateDetalleVenta,
  deleteDetalleVenta,
} = require("../controllers/salesDetail");

// Obtener todos los detalles de ventas
router.get("/", getAllDetalleVentas);

// Obtener un detalle de venta por id
router.get("/:id", getDetalleVentaById);

// Crear un nuevo detalle de venta
router.post("/", createDetalleVenta);

// Actualizar un detalle de venta por id
router.put("/:id", updateDetalleVenta);

// Eliminar un detalle de venta por id
router.delete("/:id", deleteDetalleVenta);

module.exports = router;
