const { Router } = require("express");
const router = Router();

const {
  getAllCategories,
  createCategory,
  getCategoriesInactive,
  updateCategory,
  categoryInactive,
  categoryActive,
} = require("../controllers/category");

router.get("/", getAllCategories);
router.post("/", createCategory);
router.get("/inactive", getCategoriesInactive);
router.put("/:id", updateCategory);
router.put("/:id/activate", categoryActive);
router.put("/:id/deactivate", categoryInactive);

// Opcional: aceptar PATCH
router.patch("/:id/activate", categoryActive);
router.patch("/:id/deactivate", categoryInactive);

module.exports = router;
