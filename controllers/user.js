const db = require("../database/config");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.query("SELECT * FROM usuarios WHERE activo=1");
    res.json({
      ok: true,
      users,
      status: 200,
    });
  } catch (error) {
    return next(error);
  }
};

const getUsersInactive = async (req, res, next) => {
  try {
    const [users] = await db.query("SELECT * FROM usuarios WHERE activo=0");
    res.json({
      ok: true,
      users,
      status: 200,
    });
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, rol, active } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre,email,contraseña,rol,activo) VALUES (?,?,?,?,?)",
      [name, email, hashedPassword, rol, active]
    );
    res.json({
      ok: true,
      result,
      message: "create user successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, rol, active } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "UPDATE proveedores SET nombre=? , email=? , contraseña=?, rol=?, activo=? WHERE id_proveedor=?",
      [name, email, hashedPassword, rol, active, id]
    );
    res.json({
      ok: true,
      result,
      message: "update user successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const inactiveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE proveedores SET activo=0 WHERE id_proveedor=?",
      [id]
    );
    res.json({
      ok: true,
      result,
      message: "User Inactive successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const activeUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE proveedores SET activo=1 WHERE id_proveedor=?",
      [id]
    );
    res.json({
      ok: true,
      result,
      message: "User active succesfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllUsers,
  getUsersInactive,
  createUser,
  updateUser,
  activeUser,
  inactiveUser,
};
