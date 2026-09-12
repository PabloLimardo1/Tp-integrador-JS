// controllers/profileController.js
// Maneja la relación 1:1 entre User y Profile.

const Profile = require("../models/Profile");
const User = require("../models/User");

function respond(res, statusCode, status, message, data = null) {
  return res.status(statusCode).json({ status, message, data });
}

// CREATE - Crear el perfil de un usuario (falla si ese usuario ya tiene uno, por la relación 1:1)
async function createProfile(req, res) {
  try {
    const { bio, avatarUrl, user } = req.body;

    const userExists = await User.findById(user);
    if (!userExists) {
      return respond(res, 404, "error", "El usuario indicado no existe");
    }

    const profile = await Profile.create({ bio, avatarUrl, user });
    return respond(res, 201, "success", "Perfil creado correctamente", profile);
  } catch (error) {
    if (error.code === 11000) {
      return respond(res, 409, "error", "Este usuario ya tiene un perfil creado");
    }
    if (error.name === "ValidationError") {
      return respond(res, 400, "error", error.message);
    }
    return respond(res, 500, "error", "Error interno al crear el perfil");
  }
}

// UPDATE - Actualizar el perfil de un usuario
async function updateProfile(req, res) {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return respond(res, 404, "error", "Perfil no encontrado para ese usuario");
    }

    return respond(res, 200, "success", "Perfil actualizado correctamente", profile);
  } catch (error) {
    return respond(res, 400, "error", "No se pudo actualizar el perfil");
  }
}

module.exports = { createProfile, updateProfile };
