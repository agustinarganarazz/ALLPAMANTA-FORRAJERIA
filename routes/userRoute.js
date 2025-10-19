const { Router } = require("express");
const router = Router();

const {
  getAllUsers,
  getUsersIactive,
  createUser,
  updateUser,
  activeUser,
  inactiveUser,
} = require("../controllers/user");

router.get("/", getAllUsers);
router.get("/inactive", getUsersIactive);
router.post("/", createUser);
router.put("/:id", updateUser); // actualizar
router.put("/:id/deactivate", inactiveUser);
router.put("/:id/activate", activeUser);
