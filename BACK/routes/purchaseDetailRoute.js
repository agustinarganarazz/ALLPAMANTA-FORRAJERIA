const { Router } = require("express");
const router = Router();

const {
  getAllPurchaseDetails,
  getPurchaseDetailsByPurchaseId,
  createPurchaseDetail,
  updatePurchaseDetail,
  deletePurchaseDetail,
} = require("../controllers/purchasesDetail");

// Obtener todos los detalles de compras con info de productos y compras
router.get("/", getAllPurchaseDetails);

// Obtener detalles de una compra específica
router.get("/purchase/:id", getPurchaseDetailsByPurchaseId);

// Crear un detalle de compra (subtotal calculado automáticamente)
router.post("/", createPurchaseDetail);

// Actualizar un detalle de compra (subtotal recalculado automáticamente)
router.put("/:id", updatePurchaseDetail);

// Borrar un detalle de compra
router.delete("/:id", deletePurchaseDetail);

module.exports = router;
