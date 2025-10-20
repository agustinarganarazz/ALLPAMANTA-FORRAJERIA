// routes/detalle_compras.js
const express = require("express");
const router = express.Router();
const {
  getAllDetalleCompras,
  getDetalleCompraById,
  createDetalleCompra,
  updateDetalleCompra,
  deleteDetalleCompra,
} = require("../controllers/purchasesDetail"); // ajustá nombre si lo guardaste distinto

// GET /api/detalle_compras
router.get("/", getAllDetalleCompras);

// GET /api/detalle_compras/:id
router.get("/:id", getDetalleCompraById);

// POST /api/detalle_compras
router.post("/", createDetalleCompra);

// PUT /api/detalle_compras/:id
router.put("/:id", updateDetalleCompra);

// DELETE /api/detalle_compras/:id
router.delete("/:id", deleteDetalleCompra);

module.exports = router;
