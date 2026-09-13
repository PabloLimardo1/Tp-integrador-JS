// middlewares/auth.js
// Módulo 8: protege rutas verificando que venga un JWT válido en el header Authorization.
// Formato esperado: Authorization: Bearer <token>

const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "No se envió un token de autenticación (header Authorization: Bearer <token>)",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify lanza un error si el token es inválido O si ya expiró
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // queda disponible en el resto de la petición como req.user.id
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "El token expiró, iniciá sesión de nuevo",
        data: null,
      });
    }
    return res.status(401).json({
      status: "error",
      message: "Token inválido",
      data: null,
    });
  }
}

module.exports = requireAuth;
