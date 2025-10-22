const db = require("../database/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    // Validación de campos requeridos
    if (!nombre || !email || !contraseña || !rol) {
      return res.status(400).json({
        ok: false,
        msg: "Todos los campos son requeridos",
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        ok: false,
        msg: "Formato de email inválido",
      });
    }

    // Validar si ya existe el usuario
    const [existing] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: "Email ya registrado",
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Guardar usuario
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, contraseña, rol, activo) VALUES (?, ?, ?, ?, 1)",
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json({
      ok: true,
      msg: "Usuario registrado correctamente",
      id_usuario: result.insertId,
    });
  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Validación de campos requeridos
    if (!email || !contraseña) {
      return res.status(400).json({
        ok: false,
        msg: "Email y contraseña son requeridos",
      });
    }

    // Buscar usuario
    const [users] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "Credenciales incorrectas", // Mensaje genérico por seguridad
      });
    }

    const user = users[0];

    // Verificar si está activo
    if (!user.activo) {
      return res.status(403).json({
        ok: false,
        msg: "Usuario desactivado",
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) {
      return res.status(400).json({
        ok: false,
        msg: "Credenciales incorrectas", // Mensaje genérico por seguridad
      });
    }

    // Crear token
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" } // Aumenté el tiempo de expiración
    );

    res.json({
      ok: true,
      msg: "Login exitoso",
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

module.exports = { register, login };
