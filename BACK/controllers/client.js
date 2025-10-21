const db = require("../database/config");

const getAllClients = async (req, res, next) => {
  try {
    const [clients] = await db.query("SELECT * FROM clientes WHERE activo = 1");
    res.json({
      ok: true,
      clients,
      message: "Clients retrieved successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const getClientsInactive = async (req, res, next) => {
  try {
    const [clients] = await db.query("SELECT * FROM clientes WHERE activo = 0");
    res.json({
      ok: true,
      clients,
      message: "Inactive clients retrieved successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const { name, telephone, email, direction, active } = req.body;
    const [result] = await db.execute(
      "INSERT INTO clientes (nombre, telefono, email, direccion, activo) VALUES (?, ?, ?, ?, ?)",
      [name, telephone, email, direction, active]
    );
    res.json({
      ok: true,
      message: "Client created successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, telephone, email, direction, active } = req.body;
    const [result] = await db.execute(
      "UPDATE clientes SET nombre = ?, telefono = ?, email = ?, direccion = ?, activo = ? WHERE id_cliente = ?",
      [name, telephone, email, direction, active, id]
    );
    res.json({
      ok: true,
      message: "Client updated successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

const clientInactive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE clientes SET activo = 0 WHERE id_cliente = ?",
      [id]
    );
    res.json({
      ok: true,
      message: "Client deactivated successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

const clientActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "UPDATE clientes SET activo = 1 WHERE id_cliente = ?",
      [id]
    );
    res.json({
      ok: true,
      message: "Client activated successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllClients,
  getClientsInactive,
  createClient,
  updateClient,
  clientInactive,
  clientActive,
};
