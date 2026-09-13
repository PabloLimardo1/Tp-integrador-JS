// controllers/authController.js
// Módulo 8: registro y login de usuarios, generando un JSON Web Token (JWT)
// que el cliente deberá enviar en las rutas protegidas.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

function respond(res, statusCode, status, message, data = null) {
  return res.status(statusCode).json({ status, message, data });
}

// Genera un token firmado que expira en 1 día, con el id del usuario adentro.
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

// POST /api/auth/register - Crea un usuario nuevo y devuelve un token
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return respond(res, 400, "error", "Nombre, email y contraseña son obligatorios");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    return respond(res, 201, "success", "Usuario registrado correctamente", {
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return respond(res, 409, "error", "Ya existe un usuario con ese email");
    }
    if (error.name === "ValidationError") {
      return respond(res, 400, "error", error.message);
    }
    return respond(res, 500, "error", "Error interno al registrar el usuario");
  }
}

// POST /api/auth/login - Verifica credenciales y devuelve un token
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return respond(res, 400, "error", "Email y contraseña son obligatorios");
    }

    // Se pide explícitamente el campo password (por defecto está oculto con select:false)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return respond(res, 401, "error", "Credenciales inválidas");
    }

    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
      return respond(res, 401, "error", "Credenciales inválidas");
    }

    const token = generateToken(user._id);

    return respond(res, 200, "success", "Inicio de sesión exitoso", {
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return respond(res, 500, "error", "Error interno al iniciar sesión");
  }
}

module.exports = { register, login };
