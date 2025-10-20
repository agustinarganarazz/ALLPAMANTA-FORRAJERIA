const db = require("../database/config");

// Obtener todos los detalles de ventas
const getAllDetalleVentas = async (req, res, next) => {
  try {
    const [detalleVentas] = await db.query(`
      SELECT dv.*, p.nombre AS producto, pr.nombre AS presentacion
      FROM detalle_ventas dv
      INNER JOIN productos p ON dv.id_producto = p.id_producto
      INNER JOIN presentaciones pr ON dv.id_presentacion = pr.id_presentacion
    `);
    res.json({
      ok: true,
      detalleVentas,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener detalle de venta por id_detalle
const getDetalleVentaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [detalle] = await db.query(
      "SELECT * FROM detalle_ventas WHERE id_detalle = ?",
      [id]
    );

    if (detalle.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Detalle no encontrado" });
    }

    res.json({ ok: true, detalle: detalle[0] });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo detalle de venta
const createDetalleVenta = async (req, res, next) => {
  try {
    const {
      id_venta,
      id_producto,
      id_presentacion,
      cantidad,
      precio_unitario,
      subtotal,
    } = req.body;

    if (
      !id_venta ||
      !id_producto ||
      !id_presentacion ||
      cantidad === undefined ||
      precio_unitario === undefined ||
      subtotal === undefined
    ) {
      return res
        .status(400)
        .json({ ok: false, message: "Faltan campos requeridos" });
    }

    const [result] = await db.execute(
      `INSERT INTO detalle_ventas (id_venta, id_producto, id_presentacion, cantidad, precio_unitario, subtotal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_venta,
        id_producto,
        id_presentacion,
        cantidad,
        precio_unitario,
        subtotal,
      ]
    );

    res.status(201).json({
      ok: true,
      message: "Detalle de venta creado correctamente",
      id_detalle: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un detalle de venta
const updateDetalleVenta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_venta,
      id_producto,
      id_presentacion,
      cantidad,
      precio_unitario,
      subtotal,
    } = req.body;

    const [result] = await db.execute(
      `UPDATE detalle_ventas
       SET id_venta = ?, id_producto = ?, id_presentacion = ?, cantidad = ?, precio_unitario = ?, subtotal = ?
       WHERE id_detalle = ?`,
      [
        id_venta,
        id_producto,
        id_presentacion,
        cantidad,
        precio_unitario,
        subtotal,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Detalle no encontrado" });
    }

    res.json({
      ok: true,
      message: "Detalle de venta actualizado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un detalle de venta
const deleteDetalleVenta = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM detalle_ventas WHERE id_detalle = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Detalle no encontrado" });
    }

    res.json({ ok: true, message: "Detalle de venta eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetalleVentas,
  getDetalleVentaById,
  createDetalleVenta,
  updateDetalleVenta,
  deleteDetalleVenta,
};
