const db = require("../database/config");

// Obtener todas las compras activas
const getAllPurchases = async (req, res, next) => {
  try {
    const [purchases] = await db.query(`
      SELECT c.*, p.nombre AS proveedor, u.nombre AS usuario
      FROM compras c
      INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
      INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
      ORDER BY c.fecha DESC
    `);

    res.json({
      ok: true,
      purchases,
      message: "Purchases retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Obtener una compra por ID
const getPurchaseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [purchase] = await db.query(
      `
      SELECT c.*, p.nombre AS proveedor, u.nombre AS usuario
      FROM compras c
      INNER JOIN proveedores p ON c.id_proveedor = p.id_proveedor
      INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_compra = ?
      `,
      [id]
    );

    if (purchase.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Purchase not found",
      });
    }

    res.json({
      ok: true,
      purchase: purchase[0],
      message: "Purchase retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Crear una nueva compra
const createPurchase = async (req, res, next) => {
  try {
    const { id_proveedor, id_usuario, fecha, total } = req.body;

    if (!id_proveedor || !id_usuario || !fecha || total === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Missing required fields",
      });
    }

    const [result] = await db.execute(
      "INSERT INTO compras (id_proveedor, id_usuario, fecha, total) VALUES (?, ?, ?, ?)",
      [id_proveedor, id_usuario, fecha, total]
    );

    res.json({
      ok: true,
      message: "Purchase created successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una compra
const updatePurchase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_proveedor, id_usuario, fecha, total } = req.body;

    const [result] = await db.execute(
      `
      UPDATE compras
      SET id_proveedor = ?, id_usuario = ?, fecha = ?, total = ?
      WHERE id_compra = ?
      `,
      [id_proveedor, id_usuario, fecha, total, id]
    );

    res.json({
      ok: true,
      message: "Purchase updated successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar una compra
const deletePurchase = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM compras WHERE id_compra = ?",
      [id]
    );

    res.json({
      ok: true,
      message: "Purchase deleted successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
