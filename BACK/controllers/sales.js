const db = require("../database/config");

// Obtener todas las ventas activas
const getAllSales = async (req, res, next) => {
  try {
    const [sales] = await db.query(`
      SELECT v.*, c.nombre AS cliente, u.nombre AS usuario
      FROM ventas v
      INNER JOIN clientes c ON v.id_cliente = c.id_cliente
      INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
    `);

    res.json({
      ok: true,
      sales,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener venta por ID
const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [sale] = await db.query(`SELECT * FROM ventas WHERE id_venta = ?`, [
      id,
    ]);

    if (sale.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Venta no encontrada",
      });
    }

    res.json({
      ok: true,
      sale: sale[0],
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

// Crear nueva venta
const createSale = async (req, res, next) => {
  try {
    const { id_cliente, id_usuario, fecha, total } = req.body;

    if (!id_cliente || !id_usuario || !fecha || total === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Faltan campos requeridos",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO ventas (id_cliente, id_usuario, fecha, total)
       VALUES (?, ?, ?, ?)`,
      [id_cliente, id_usuario, fecha, total]
    );

    res.status(201).json({
      ok: true,
      message: "Venta creada exitosamente",
      saleId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar venta
const updateSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_cliente, id_usuario, fecha, total } = req.body;

    const [result] = await db.execute(
      `UPDATE ventas SET id_cliente = ?, id_usuario = ?, fecha = ?, total = ? WHERE id_venta = ?`,
      [id_cliente, id_usuario, fecha, total, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "Venta no encontrada",
      });
    }

    res.json({
      ok: true,
      message: "Venta actualizada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar venta
const deleteSale = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(`DELETE FROM ventas WHERE id_venta = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        message: "Venta no encontrada",
      });
    }

    res.json({
      ok: true,
      message: "Venta eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
};
