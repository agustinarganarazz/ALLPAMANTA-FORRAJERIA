const { Router } = require("express");
const router = Router();
const { registerSale } = require("../controllers/registerSale");

router.post("/", registerSale);

module.exports = router;
