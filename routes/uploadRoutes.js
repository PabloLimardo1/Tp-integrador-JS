// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const requireAuth = require("../middlewares/auth");
const uploadController = require("../controllers/uploadController");

// Ruta protegida: hay que estar autenticado para subir un archivo
router.post("/", requireAuth, upload.single("file"), uploadController.uploadFile);

module.exports = router;
