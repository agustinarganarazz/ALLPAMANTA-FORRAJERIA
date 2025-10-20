const express = require("express");
const router = express.Router();
const {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
} = require("../controllers/purchases");

// Rutas para compras
router.get("/", getAllPurchases); // Obtener todas las compras
router.get("/:id", getPurchaseById); // Obtener una compra por ID
router.post("/", createPurchase); // Crear nueva compra
router.put("/:id", updatePurchase); // Actualizar compra por ID
router.delete("/:id", deletePurchase); // Eliminar compra por ID

module.exports = router;
