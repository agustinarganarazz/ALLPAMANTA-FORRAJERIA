const db = require("../database/config");

const getAllCategories = async (req, res , next) => {
  try {
    const [categories] = await db.query(
      "SELECT * FROM categorias WHERE activo = 1"
    );
    res.json({
      ok: true,
      categories,
      message: "Categories retrieved successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const getCategoriesInactive = async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT * FROM categorias WHERE activo = 0"
    );
    res.json({
      ok: true,
      categories,
      message: "Inactive categories retrieved successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const [result] = await db.execute(
      "INSERT INTO categorias (nombre,activo) VALUES (?,1)",
      [name]
    );
    res.json({
      ok: true,
      message: "Category created successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

const updateCategory = async (req, res,next ) => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;
    const [result] = await db.execute(
      "UPDATE categorias SET nombre = ?, activo = ? WHERE id_categoria = ?",
      [name, active, id]
    );
    res.json({
      ok: true,
      message: "Category updated successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

const categoryInactive = async (req, res , next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE categorias SET activo = 0 WHERE id_categoria = ?",
      [id]
    );
    res.json({
      ok: true,
      message: "Category deactivated successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

const categoryActive = async (req, res , next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE categorias SET activo = 1 WHERE id_categoria = ?",
      [id]
    );
    res.json({
      ok: true,
      message: "Category activated successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategoriesInactive,
  updateCategory,
  categoryInactive,
  categoryActive,
};
