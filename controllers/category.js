const db = require("../database/config");

const getAllCategories = async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error retrieving categories",
    });
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
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error retrieving inactive categories",
    });
  }
};

const createCategory = async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error creating category",
    });
  }
};

const updateCategory = async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error updating category",
    });
  }
};

const categoryInactive = async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error deactivating category",
    });
  }
};

const categoryActive = async (req, res) => {
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
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Error activating category",
    });
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
