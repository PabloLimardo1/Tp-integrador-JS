// middlewares/logger.js
// Middleware de persistencia en archivo plano.
// Registra cada acceso a una ruta con fecha, hora y ruta accedida en logs/log.txt

const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "..", "logs", "log.txt");

function logger(req, res, next) {
  const now = new Date();
  const fecha = now.toLocaleDateString("es-AR");
  const hora = now.toLocaleTimeString("es-AR");
  const linea = `[${fecha} ${hora}] Acceso a: ${req.method} ${req.originalUrl}\n`;

  // fs.appendFile agrega la línea al final del archivo sin borrar lo anterior
  fs.appendFile(logFilePath, linea, (err) => {
    if (err) {
      console.error("Error al escribir en el log:", err);
    }
  });

  // next() permite que la petición siga su curso hacia la siguiente ruta/middleware
  next();
}

module.exports = logger;
