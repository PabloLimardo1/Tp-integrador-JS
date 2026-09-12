// controllers/mainController.js
// Los controladores contienen la lógica de qué responder ante cada ruta.
// Así las rutas quedan "limpias" y solo se encargan de conectar URL -> función.

const path = require("path");

// GET / -> responde con HTML (sirve la página principal desde /public)
function home(req, res) {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
}

// GET /status -> responde con JSON, útil para monitoreo o testing rápido
function status(req, res) {
  res.status(200).json({
    status: "ok",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
}

module.exports = { home, status };
