// controllers/uploadController.js
// Módulo 8: maneja la subida de archivos y, opcionalmente (tarea PLUS),
// vincula el archivo subido al perfil del usuario como foto (avatarUrl).

const Profile = require("../models/Profile");

function respond(res, statusCode, status, message, data = null) {
  return res.status(statusCode).json({ status, message, data });
}

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return respond(res, 400, "error", "No se recibió ningún archivo");
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Tarea PLUS: si en el body viene un userId, se asocia el archivo
    // como foto de perfil (avatarUrl) de ese usuario.
    if (req.body.userId) {
      const profile = await Profile.findOneAndUpdate(
        { user: req.body.userId },
        { avatarUrl: fileUrl },
        { new: true }
      );

      if (!profile) {
        return respond(
          res,
          404,
          "error",
          "Archivo subido, pero no se encontró un perfil para ese userId",
          { fileUrl }
        );
      }

      return respond(res, 200, "success", "Archivo subido y vinculado al perfil", {
        fileUrl,
        profile,
      });
    }

    return respond(res, 200, "success", "Archivo subido correctamente", { fileUrl });
  } catch (error) {
    return respond(res, 500, "error", "Error interno al subir el archivo");
  }
}

module.exports = { uploadFile };
