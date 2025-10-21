const { Router } = require("express");
const router = Router();

const {
  getAllSuppliers,
  getSuppliersInactive,
  supplierActive,
  supplierInactive,
  updateSuppliers,
  createSuppliers,
} = require("../controllers/suppliers");

router.get("/", getAllSuppliers);
router.get("/inactive", getSuppliersInactive);
router.post("/", createSuppliers);
router.put("/:id", updateSuppliers);
router.put("/:id/deactivate", supplierInactive);
router.put("/:id/activate", supplierActive);

module.exports = router;
