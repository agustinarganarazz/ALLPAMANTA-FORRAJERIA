const db = require("../database/config");

// Obtener todos los detalles de compras
const getAllDetalleCompras = async (req, res, next) => {
  try {
    const [detalles] = await db.query("SELECT * FROM detalle_compras");
    res.json({
      ok: true,
      detalles,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener detalle de compra por id
const getDetalleCompraById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [detalle] = await db.query(
      "SELECT * FROM detalle_compras WHERE id_detalle_compra = ?",
      [id]
    );
    if (detalle.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Detalle de compra no encontrado",
      });
    }
    res.json({
      ok: true,
      detalle: detalle[0],
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo detalle de compra
const createDetalleCompra = async (req, res, next) => {
  try {
    const { id_compra, id_producto, cantidad, precio_unitario } = req.body;

    if (
      !id_compra ||
      !id_producto ||
      cantidad === undefined ||
      precio_unitario === undefined
    ) {
      return res.status(400).json({
        ok: false,
        message: "Faltan campos obligatorios",
      });
    }

    const subtotal = cantidad * precio_unitario;

    const [result] = await db.execute(
      "INSERT INTO detalle_compras (id_compra, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)",
      [id_compra, id_producto, cantidad, precio_unitario, subtotal]
    );

    res.status(201).json({
      ok: true,
      message: "Detalle de compra creado",
      id_detalle_compra: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un detalle de compra
const updateDetalleCompra = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_compra, id_producto, cantidad, precio_unitario } = req.body;

    if (
      !id_compra ||
      !id_producto ||
      cantidad === undefined ||
      precio_unitario === undefined
    ) {
      return res.status(400).json({
        ok: false,
        message: "Faltan campos obligatorios",
      });
    }

    const subtotal = cantidad * precio_unitario;

    const [result] = await db.execute(
      "UPDATE detalle_compras SET id_compra = ?, id_producto = ?, cantidad = ?, precio_unitario = ?, subtotal = ? WHERE id_detalle_compra = ?",
      [id_compra, id_producto, cantidad, precio_unitario, subtotal, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "Detalle de compra no encontrado",
      });
    }

    res.json({
      ok: true,
      message: "Detalle de compra actualizado",
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un detalle de compra
const deleteDetalleCompra = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "DELETE FROM detalle_compras WHERE id_detalle_compra = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "Detalle de compra no encontrado",
      });
    }

    res.json({
      ok: true,
      message: "Detalle de compra eliminado",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDetalleCompras,
  getDetalleCompraById,
  createDetalleCompra,
  updateDetalleCompra,
  deleteDetalleCompra,
};
