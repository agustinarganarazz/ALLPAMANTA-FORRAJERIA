const db = require("../database/config");

// Obtener todos los detalles de ventas
const getAllDetalleVentas = async (req, res, next) => {
  try {
    const [detalleVentas] = await db.query(`
      SELECT dv.*, p.nombre AS producto, pr.nombre_presentacion AS presentacion
      FROM detalle_ventas dv
      INNER JOIN productos p ON dv.id_producto = p.id_producto
      INNER JOIN presentaciones pr ON dv.id_presentacion = pr.id_presentacion
    `);
    res.json({ ok: true, detalleVentas, status: 200 });
  } catch (error) {
    next(error);
  }
};

// Obtener detalle de venta por ID
const getDetalleVentaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [detalle] = await db.query(
      "SELECT * FROM detalle_ventas WHERE id_detalle = ?",
      [id]
    );

    if (detalle.length === 0)
      return res
        .status(404)
        .json({ ok: false, message: "Detalle no encontrado" });

    res.json({ ok: true, detalle: detalle[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDetalleVentas, getDetalleVentaById };
