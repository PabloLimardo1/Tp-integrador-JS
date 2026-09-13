// middlewares/upload.js
// Módulo 8: configuración de multer para la subida de archivos,
// validando tipo (solo imágenes) y tamaño máximo (2MB).

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    // Nombre único: timestamp + nombre original, para evitar que se pisen archivos
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Solo se permiten imágenes (jpeg, jpg, png, gif)
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    return cb(null, true);
  }
  cb(new Error("Solo se permiten imágenes (jpg, jpeg, png, gif)"));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB máximo
});

module.exports = upload;
