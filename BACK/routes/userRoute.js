const { Router } = require("express");
const router = Router();

const {
  getAllUsers,
  getUsersInactive,
  createUser,
  updateUser,
  activeUser,
  inactiveUser,
} = require("../controllers/user");

router.get("/", getAllUsers);
router.get("/inactive", getUsersInactive);
router.post("/", createUser);
router.put("/:id", updateUser); // actualizar
router.put("/:id/deactivate", inactiveUser);
router.put("/:id/activate", activeUser);

module.exports = router;
