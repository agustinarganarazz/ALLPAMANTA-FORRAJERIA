const db = require("../database/config");

// Registrar venta completa con detalles y actualización de stock
const registerSale = async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id_cliente, id_usuario, fecha, detalles } = req.body;
    // detalles = [{ id_producto, id_presentacion, cantidad, precio_unitario }, ...]

    // Validaciones iniciales
    if (!id_cliente || !id_usuario || !fecha) {
      return res.status(400).json({
        ok: false,
        message: "Faltan datos requeridos: id_cliente, id_usuario, fecha",
      });
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Debe incluir al menos un detalle de venta",
      });
    }

    // Calcular el total basado en los detalles
    let totalCalculado = 0;

    // Validar stock antes de procesar
    for (const item of detalles) {
      const { id_producto, id_presentacion, cantidad, precio_unitario } = item;

      if (!id_producto || !id_presentacion || !cantidad || !precio_unitario) {
        throw new Error(
          "Cada detalle debe incluir: id_producto, id_presentacion, cantidad, precio_unitario"
        );
      }

      if (cantidad <= 0) {
        throw new Error(
          `La cantidad debe ser mayor a 0 para el producto ID ${id_producto}`
        );
      }

      if (precio_unitario < 0) {
        throw new Error(
          `El precio unitario no puede ser negativo para el producto ID ${id_producto}`
        );
      }

      // Verificar stock disponible
      const [stockCheck] = await connection.execute(
        `SELECT stock_total, nombre FROM productos WHERE id_producto = ?`,
        [id_producto]
      );

      if (stockCheck.length === 0) {
        throw new Error(`Producto con ID ${id_producto} no encontrado`);
      }

      if (stockCheck[0].stock_total < cantidad) {
        throw new Error(
          `Stock insuficiente para ${stockCheck[0].nombre}. ` +
            `Disponible: ${stockCheck[0].stock_total}, Solicitado: ${cantidad}`
        );
      }

      totalCalculado += cantidad * precio_unitario;
    }

    // Insertar venta principal
    const [ventaResult] = await connection.execute(
      `INSERT INTO ventas (id_cliente, id_usuario, fecha, total) VALUES (?, ?, ?, ?)`,
      [id_cliente, id_usuario, fecha, totalCalculado]
    );

    const id_venta = ventaResult.insertId;

    // Insertar detalles y actualizar stock
    for (const item of detalles) {
      const { id_producto, id_presentacion, cantidad, precio_unitario } = item;
      const subtotal = cantidad * precio_unitario;

      // Insertar detalle de venta
      await connection.execute(
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

      // Actualizar stock
      await connection.execute(
        `UPDATE productos SET stock_total = stock_total - ? WHERE id_producto = ?`,
        [cantidad, id_producto]
      );
    }

    await connection.commit();

    res.status(201).json({
      ok: true,
      message: "Venta registrada correctamente",
      id_venta,
      total: totalCalculado,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error en registerSale:", error);

    // Enviar error específico al cliente
    res.status(400).json({
      ok: false,
      message: error.message || "Error al registrar la venta",
    });
  } finally {
    connection.release();
  }
};

// Obtener ventas con sus detalles
const getSaleWithDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener venta principal
    const [sale] = await db.query(
      `
      SELECT v.*, c.nombre AS cliente, u.nombre AS usuario
      FROM ventas v
      INNER JOIN clientes c ON v.id_cliente = c.id_cliente
      INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
      WHERE v.id_venta = ?
    `,
      [id]
    );

    if (sale.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Venta no encontrada",
      });
    }

    // Obtener detalles de la venta
    const [details] = await db.query(
      `
      SELECT
        dv.*,
        p.nombre AS producto,
        pr.nombre_presentacion AS presentacion
      FROM detalle_ventas dv
      INNER JOIN productos p ON dv.id_producto = p.id_producto
      INNER JOIN presentaciones pr ON dv.id_presentacion = pr.id_presentacion
      WHERE dv.id_venta = ?
    `,
      [id]
    );

    res.json({
      ok: true,
      sale: {
        ...sale[0],
        detalles: details,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerSale,
  getSaleWithDetails,
};
