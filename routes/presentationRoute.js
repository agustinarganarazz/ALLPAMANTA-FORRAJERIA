const { Router } = require("express");
const router = Router();

const {
  getAllPresentations,
  getPresentationsByProduct,
  createPresentation,
  updatePresentation,
  deletePresentation,
} = require("../controllers/presentations");

router.get("/", getAllPresentations);
router.get("/product/:id_producto", getPresentationsByProduct);
router.post("/", createPresentation);
router.put("/:id", updatePresentation);
router.delete("/:id", deletePresentation);

module.exports = router;
