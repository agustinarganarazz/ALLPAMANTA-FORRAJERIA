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
router.get("/inactive", getCategoriesInactive);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.put("/:id/deactivate", categoryInactive);
router.put("/:id/activate", categoryActive);

module.exports = router;
