const db = require("../database/config");

// Registrar venta completa con detalles y actualización de stock
const registerSale = async (req, res, next) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { id_cliente, id_usuario, fecha, total, detalles } = req.body;
    // detalles = [{ id_producto, id_presentacion, cantidad, precio_unitario }, ...]

    if (
      !id_cliente ||
      !id_usuario ||
      !fecha ||
      !Array.isArray(detalles) ||
      detalles.length === 0
    )
      return res
        .status(400)
        .json({ ok: false, message: "Datos incompletos o detalles vacíos" });

    // Insertar venta principal
    const [ventaResult] = await connection.execute(
      `INSERT INTO ventas (id_cliente, id_usuario, fecha, total) VALUES (?, ?, ?, ?)`,
      [id_cliente, id_usuario, fecha, total]
    );
    const id_venta = ventaResult.insertId;

    // Insertar detalles y actualizar stock
    for (const item of detalles) {
      const { id_producto, id_presentacion, cantidad, precio_unitario } = item;

      if (!id_producto || !id_presentacion || !cantidad || !precio_unitario)
        throw new Error("Detalle de venta inválido");

      const subtotal = cantidad * precio_unitario;

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

      const [stockUpdate] = await connection.execute(
        `UPDATE productos SET stock_total = stock_total - ? WHERE id_producto = ? AND stock_total >= ?`,
        [cantidad, id_producto, cantidad]
      );

      if (stockUpdate.affectedRows === 0)
        throw new Error(`Stock insuficiente para producto ID ${id_producto}`);
    }

    await connection.commit();

    res
      .status(201)
      .json({ ok: true, message: "Venta registrada correctamente", id_venta });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = { registerSale };
