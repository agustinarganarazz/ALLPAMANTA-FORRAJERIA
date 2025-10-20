const db = require("../database/config");

// Obtener todas las presentaciones
const getAllPresentations = async (req, res, next) => {
  try {
    const [presentations] = await db.query("SELECT * FROM presentaciones");
    res.json({
      ok: true,
      presentations,
      message: "Presentations retrieved successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Obtener presentaciones por producto
const getPresentationsByProduct = async (req, res, next) => {
  try {
    const { id_producto } = req.params;
    const [presentations] = await db.query(
      "SELECT * FROM presentaciones WHERE id_producto = ?",
      [id_producto]
    );
    res.json({
      ok: true,
      presentations,
      message: "Presentations for product retrieved successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Crear una nueva presentación
const createPresentation = async (req, res, next) => {
  try {
    const { id_producto, nombre_presentacion, cantidad, precio_venta, costo } =
      req.body;

    const [result] = await db.execute(
      "INSERT INTO presentaciones (id_producto, nombre_presentacion, cantidad, precio_venta, costo) VALUES (?, ?, ?, ?, ?)",
      [id_producto, nombre_presentacion, cantidad, precio_venta, costo]
    );

    res.json({
      ok: true,
      message: "Presentation created successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

// Actualizar una presentación
const updatePresentation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_producto, nombre_presentacion, cantidad, precio_venta, costo } =
      req.body;

    const [result] = await db.execute(
      `UPDATE presentaciones
       SET id_producto = ?, nombre_presentacion = ?, cantidad = ?, precio_venta = ?, costo = ?
       WHERE id_presentacion = ?`,
      [id_producto, nombre_presentacion, cantidad, precio_venta, costo, id]
    );

    res.json({
      ok: true,
      message: "Presentation updated successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

// Eliminar una presentación
const deletePresentation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM presentaciones WHERE id_presentacion = ?",
      [id]
    );

    res.json({
      ok: true,
      message: "Presentation deleted successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllPresentations,
  getPresentationsByProduct,
  createPresentation,
  updatePresentation,
  deletePresentation,
};
