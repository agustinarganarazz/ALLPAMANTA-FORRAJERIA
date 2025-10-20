const db = require("../database/config");

// Obtener todos los detalles de compras con info de producto y compra
const getAllPurchaseDetails = async (req, res, next) => {
  try {
    const [details] = await db.query(`
      SELECT
        dc.id_detalle_compra,
        dc.id_compra,
        c.fecha AS fecha_compra,
        c.id_proveedor,
        dc.id_producto,
        p.nombre AS nombre_producto,
        p.descripcion AS descripcion_producto,
        dc.cantidad,
        dc.precio_unitario,
        dc.subtotal
      FROM detalle_compras dc
      INNER JOIN compras c ON dc.id_compra = c.id_compra
      INNER JOIN productos p ON dc.id_producto = p.id_producto
      ORDER BY dc.id_detalle_compra DESC
    `);

    res.json({
      ok: true,
      details,
      message:
        "Purchase details with product and purchase info retrieved successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const getPurchaseDetailsByPurchaseId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "id_compra is required",
      });
    }

    const [details] = await db.query(
      `
      SELECT
        dc.id_detalle_compra,
        dc.id_compra,
        c.fecha AS fecha_compra,
        c.id_proveedor,
        dc.id_producto,
        p.nombre AS nombre_producto,
        p.descripcion AS descripcion_producto,
        dc.cantidad,
        dc.precio_unitario,
        dc.subtotal
      FROM detalle_compras dc
      INNER JOIN compras c ON dc.id_compra = c.id_compra
      INNER JOIN productos p ON dc.id_producto = p.id_producto
      WHERE dc.id_compra = ?
      ORDER BY dc.id_detalle_compra ASC
    `,
      [id]
    );

    res.json({
      ok: true,
      details,
      message: `Purchase details for purchase ID ${id} retrieved successfully`,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllPurchaseDetails,
  getPurchaseDetailsByPurchaseId,
  createPurchaseDetail,
  updatePurchaseDetail,
  deletePurchaseDetail,
};

// Crear un detalle de compra
const createPurchaseDetail = async (req, res, next) => {
  try {
    const { id_compra, id_producto, cantidad, precio_unitario } = req.body;

    // Validaciones básicas
    if (!id_compra || !id_producto) {
      return res
        .status(400)
        .json({ ok: false, message: "id_compra and id_producto are required" });
    }
    if (cantidad === undefined || precio_unitario === undefined) {
      return res.status(400).json({
        ok: false,
        message: "cantidad and precio_unitario are required",
      });
    }
    if (cantidad <= 0 || precio_unitario < 0) {
      return res.status(400).json({
        ok: false,
        message: "cantidad must be > 0 and precio_unitario >= 0",
      });
    }

    const subtotal = parseFloat(cantidad) * parseFloat(precio_unitario);

    const [result] = await db.execute(
      "INSERT INTO detalle_compras (id_compra, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
      [id_compra, id_producto, cantidad, precio_unitario, subtotal]
    );

    res.json({
      ok: true,
      message: "Purchase detail created successfully",
      result,
      calculatedSubtotal: subtotal,
    });
  } catch (error) {
    return next(error);
  }
};

// Actualizar un detalle de compra
const updatePurchaseDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_compra, id_producto, cantidad, precio_unitario } = req.body;

    if (!id_compra || !id_producto) {
      return res
        .status(400)
        .json({ ok: false, message: "id_compra and id_producto are required" });
    }
    if (cantidad === undefined || precio_unitario === undefined) {
      return res.status(400).json({
        ok: false,
        message: "cantidad and precio_unitario are required",
      });
    }
    if (cantidad <= 0 || precio_unitario < 0) {
      return res.status(400).json({
        ok: false,
        message: "cantidad must be > 0 and precio_unitario >= 0",
      });
    }

    const subtotal = parseFloat(cantidad) * parseFloat(precio_unitario);

    const [result] = await db.execute(
      "UPDATE detalle_compras SET id_compra = ?, id_producto = ?, cantidad = ?, precio_unitario = ?, subtotal = ? WHERE id_detalle_compra = ?",
      [id_compra, id_producto, cantidad, precio_unitario, subtotal, id]
    );

    res.json({
      ok: true,
      message: "Purchase detail updated successfully",
      result,
      calculatedSubtotal: subtotal,
    });
  } catch (error) {
    return next(error);
  }
};

// Borrar un detalle de compra
const deletePurchaseDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM detalle_compras WHERE id_detalle_compra = ?",
      [id]
    );

    res.json({
      ok: true,
      message: "Purchase detail deleted successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllPurchaseDetails,
  createPurchaseDetail,
  updatePurchaseDetail,
  deletePurchaseDetail,
  getPurchaseDetailsByPurchaseId,
};
