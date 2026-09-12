// routes/index.js
// Router externo (tarea PLUS): centraliza las rutas y las conecta con app.js
// mediante app.use(), en vez de definirlas todas directamente en app.js.

const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

// Ruta pública que sirve contenido HTML
router.get("/", mainController.home);

// Ruta pública que responde en formato JSON
router.get("/status", mainController.status);

module.exports = router;
