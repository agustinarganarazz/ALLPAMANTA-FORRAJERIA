const db = require("../database/config");

const getAllSuppliers = async (req, res, next) => {
  try {
    const [suppliers] = await db.query(
      "SELECT * FROM proveedores WHERE activo = 1"
    );
    res.json({
      ok: true,
      suppliers,
      messaje: "Get Suppliers OK",
    });
  } catch (error) {
    return next(error);
  }
};

const getSuppliersInactive = async (req, res, next) => {
  try {
    const [suppliers] = await db.query(
      "SELECT * FROM proveedores WHERE activo = 0"
    );
    res.json({
      ok: true,
      suppliers,
      message: "GET Suppliers Inactive",
    });
  } catch (error) {
    return next(error);
  }
};

const createSuppliers = async (req, res, next) => {
  try {
    const { name, email, telephone, direction } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        ok: false,
        message: "Name and email are required",
      });
    }

    const [result] = await db.execute(
      `INSERT INTO proveedores (nombre, email, telefono, direccion, activo)
       VALUES (?, ?, ?, ?, 1)`,
      [name, email, telephone ?? null, direction ?? null]
    );

    res.json({
      ok: true,
      result,
      message: "Supplier created successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const updateSuppliers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, telephone, email, direction, active } = req.body;
    const result = await db.execute(
      "UPDATE proveedores SET nombre=?, telefono=? ,email=?, direccion=?, activo=? WHERE id_proveedor =?",
      [name, telephone, email, direction, active, id]
    );
    res.json({
      ok: true,
      result,
      message: "Supplier update successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const supplierInactive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE proveedores SET activo=0 WHERE id_proveedor=?",
      [id]
    );
    res.json({
      ok: true,
      result,
      message: "Supplier deactivated sucessfully",
    });
  } catch (error) {
    return next(error);
  }
};

const supplierActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE proveedores SET activo=1 WHERE id_proveedor=?",
      [id]
    );
    res.json({
      ok: true,
      result,
      message: "Supplier activated sucessfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllSuppliers,
  getSuppliersInactive,
  createSuppliers,
  updateSuppliers,
  supplierActive,
  supplierInactive,
};
