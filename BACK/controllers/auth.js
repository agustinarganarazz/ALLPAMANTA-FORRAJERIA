const db = require("../database/config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    // Validar si ya existe el usuario
    const [existing] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    if (existing.length > 0)
      return res.status(400).json({ msg: "Email ya registrado" });

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Guardar usuario
    await db.query(
      "INSERT INTO usuarios (nombre, email, contraseña, rol, activo) VALUES (?, ?, ?, ?, 1)",
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json({ msg: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Buscar usuario
    const [users] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(400).json({ msg: "Usuario no encontrado" });

    const user = users[0];

    // Verificar si está activo
    if (!user.activo)
      return res.status(403).json({ msg: "Usuario desactivado" });

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Crear token
    const token = jwt.sign(
      { id_usuario: user.id_usuario, nombre: user.nombre, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

module.exports = { register, login };
