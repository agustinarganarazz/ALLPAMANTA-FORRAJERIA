const db = require("../database/config");

// Obtener todas las ventas
const getAllSales = async (req, res, next) => {
  try {
    const [sales] = await db.query(`
      SELECT v.*, c.nombre AS cliente, u.nombre AS usuario
      FROM ventas v
      INNER JOIN clientes c ON v.id_cliente = c.id_cliente
      INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
    `);
    res.json({ ok: true, sales, status: 200 });
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

    if (sale.length === 0)
      return res
        .status(404)
        .json({ ok: false, message: "Venta no encontrada" });

    res.json({ ok: true, sale: sale[0], status: 200 });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSales, getSaleById };
