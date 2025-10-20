const { Router } = require("express");
const router = Router();

const {
  getAllClients,
  getClientsInactive,
  createClient,
  updateClient,
  clientInactive,
  clientActive,
} = require("../controllers/client");

router.get("/", getAllClients);
router.post("/", createClient);
router.get("/inactive", getClientsInactive);
router.put("/:id", updateClient);
router.put("/:id/deactivate", clientInactive);
router.put("/:id/activate", clientActive);

module.exports = router;
