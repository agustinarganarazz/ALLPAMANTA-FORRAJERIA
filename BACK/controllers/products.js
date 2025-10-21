const db = require("../database/config");

// Obtener todos los productos activos
const getAllProducts = async (req, res, next) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM productos WHERE activo = 1"
    );
    res.json({
      ok: true,
      products,
      status: 200,
    });
  } catch (error) {
    return next(error);
  }
};

// Obtener productos inactivos
const getProductsInactive = async (req, res, next) => {
  try {
    const [products] = await db.query(
      "SELECT * FROM productos WHERE activo = 0"
    );
    res.json({
      ok: true,
      products,
      status: 200,
    });
  } catch (error) {
    return next(error);
  }
};

// Crear nuevo producto
const createProduct = async (req, res, next) => {
  try {
    let {
      name,
      id_categoria,
      id_proveedor,
      base_unit,
      description,
      active,
      stock_total,
    } = req.body;

    // Validaciones básicas
    if (!name || !id_categoria || !id_proveedor || !base_unit) {
      return res.status(400).json({
        ok: false,
        message: "Nombre, categoría, proveedor y unidad base son obligatorios",
      });
    }

    stock_total = stock_total !== undefined ? stock_total : 0; // valor por defecto
    active = active !== undefined ? active : 1; // activo por defecto

    const [result] = await db.execute(
      `INSERT INTO productos
        (nombre, id_categoria, id_proveedor, unidad_base, stock_total, descripcion, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        id_categoria,
        id_proveedor,
        base_unit,
        stock_total,
        description || "",
        active,
      ]
    );

    res.json({
      ok: true,
      result,
      message: "Producto creado correctamente",
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// Actualizar producto
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, id_categoria, id_proveedor, base_unit, description, active } =
      req.body;

    const [result] = await db.execute(
      `UPDATE productos
      SET nombre = ?, id_categoria = ?, id_proveedor = ?, unidad_base = ?, stock_total = ?, descripcion = ?, activo = ?
      WHERE id_producto = ?`,
      [
        name,
        id_categoria,
        id_proveedor,
        base_unit,
        stock_total,
        description,
        active,
        id,
      ]
    );

    res.json({
      ok: true,
      result,
      message: "Product updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Inactivar producto
const inactiveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE productos SET activo = 0 WHERE id_producto = ?",
      [id]
    );
    res.json({
      ok: true,
      result,
      message: "Product set as inactive successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Activar producto
const activeProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE productos SET activo = 1 WHERE id_producto = ?",
      [id]
    );
    res.json({
      ok: true,
      result,
      message: "Product set as active successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductsInactive,
  createProduct,
  updateProduct,
  inactiveProduct,
  activeProduct,
};
