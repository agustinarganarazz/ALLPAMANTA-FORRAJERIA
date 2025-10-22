const {Router} = require('express');
const router = Router();
const {registerSale} = require('../controllers/registerSaleController');

router.post("/", registerSale);

module.exports = router;
