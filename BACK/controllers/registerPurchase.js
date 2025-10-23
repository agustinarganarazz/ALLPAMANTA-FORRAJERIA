const db = require("../database/config");

// Registrar compra completa con detalles y actualización de stock
const registerPurchase = async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { id_proveedor, id_usuario, fecha, detalles } = req.body;
    // detalles = [{ id_producto, cantidad, precio_unitario }, ...]

    // Validaciones iniciales
    if (!id_proveedor || !id_usuario || !fecha) {
      return res.status(400).json({
        ok: false,
        message: "Faltan datos requeridos: id_proveedor, id_usuario, fecha",
      });
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Debe incluir al menos un detalle de compra",
      });
    }

    // Calcular el total basado en los detalles
    let totalCalculado = 0;

    // Validar datos antes de procesar
    for (const item of detalles) {
      const { id_producto, cantidad, precio_unitario } = item;

      if (!id_producto || !cantidad || !precio_unitario) {
        throw new Error(
          "Cada detalle debe incluir: id_producto, cantidad, precio_unitario"
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

      // Verificar que el producto existe
      const [productCheck] = await connection.execute(
        `SELECT id_producto, nombre FROM productos WHERE id_producto = ?`,
        [id_producto]
      );

      if (productCheck.length === 0) {
        throw new Error(`Producto con ID ${id_producto} no encontrado`);
      }

      totalCalculado += cantidad * precio_unitario;
    }

    // Insertar compra principal
    const [compraResult] = await connection.execute(
      `INSERT INTO compras (id_proveedor, id_usuario, fecha, total) VALUES (?, ?, ?, ?)`,
      [id_proveedor, id_usuario, fecha, totalCalculado]
    );

    const id_compra = compraResult.insertId;

    // Insertar detalles y actualizar stock
    for (const item of detalles) {
      const { id_producto, cantidad, precio_unitario } = item;
      const subtotal = cantidad * precio_unitario;

      // Insertar detalle de compra
      await connection.execute(
        `INSERT INTO detalle_compras (id_compra, id_producto, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [id_compra, id_producto, cantidad, precio_unitario, subtotal]
      );

      // Actualizar stock (SUMAR porque es una compra)
      await connection.execute(
        `UPDATE productos SET stock_total = stock_total + ? WHERE id_producto = ?`,
        [cantidad, id_producto]
      );
    }

    await connection.commit();

    res.status(201).json({
      ok: true,
      message: "Compra registrada correctamente",
      id_compra,
      total: totalCalculado,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error en registerPurchase:", error);

    res.status(400).json({
      ok: false,
      message: error.message || "Error al registrar la compra",
    });
  } finally {
    connection.release();
  }
};

// Obtener compra con sus detalles
const getPurchaseWithDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Obtener compra principal
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
        message: "Compra no encontrada",
      });
    }

    // Obtener detalles de la compra
    const [details] = await db.query(
      `
      SELECT
        dc.*,
        p.nombre AS producto,
        p.descripcion AS descripcion_producto
      FROM detalle_compras dc
      INNER JOIN productos p ON dc.id_producto = p.id_producto
      WHERE dc.id_compra = ?
    `,
      [id]
    );

    res.json({
      ok: true,
      purchase: {
        ...purchase[0],
        detalles: details,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerPurchase,
  getPurchaseWithDetails,
};
