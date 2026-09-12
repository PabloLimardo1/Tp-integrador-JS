// controllers/userController.js
// CRUD completo sobre la entidad User, con manejo de errores y validaciones.

const User = require("../models/User");
const Profile = require("../models/Profile");

// Formato de respuesta consistente para toda la API: { status, message, data }
function respond(res, statusCode, status, message, data = null) {
  return res.status(statusCode).json({ status, message, data });
}

// CREATE - Crear un usuario
async function createUser(req, res) {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    return respond(res, 201, "success", "Usuario creado correctamente", user);
  } catch (error) {
    // error.code 11000 = email duplicado (violación de índice único)
    if (error.code === 11000) {
      return respond(res, 409, "error", "Ya existe un usuario con ese email");
    }
    if (error.name === "ValidationError") {
      return respond(res, 400, "error", error.message);
    }
    return respond(res, 500, "error", "Error interno al crear el usuario");
  }
}

// READ - Listar usuarios, con búsqueda filtrada opcional por nombre (?name=...)
async function getUsers(req, res) {
  try {
    const { name } = req.query;
    const filter = {};

    // Búsqueda dinámica: si viene "name" en la query, filtra por coincidencia parcial (case-insensitive)
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const users = await User.find(filter);
    return respond(res, 200, "success", "Usuarios obtenidos correctamente", users);
  } catch (error) {
    return respond(res, 500, "error", "Error interno al obtener los usuarios");
  }
}

// READ - Obtener un usuario por ID, incluyendo su perfil (relación 1:1)
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return respond(res, 404, "error", "Usuario no encontrado");
    }

    const profile = await Profile.findOne({ user: user._id });
    return respond(res, 200, "success", "Usuario obtenido correctamente", {
      user,
      profile: profile || null,
    });
  } catch (error) {
    return respond(res, 400, "error", "ID de usuario inválido");
  }
}

// UPDATE - Actualizar un usuario
async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // devuelve el documento ya actualizado
      runValidators: true, // aplica las validaciones del schema también en el update
    });

    if (!user) {
      return respond(res, 404, "error", "Usuario no encontrado");
    }

    return respond(res, 200, "success", "Usuario actualizado correctamente", user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return respond(res, 400, "error", error.message);
    }
    return respond(res, 400, "error", "No se pudo actualizar el usuario");
  }
}

// DELETE - Eliminar un usuario (y su perfil asociado, para no dejar datos huérfanos)
async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return respond(res, 404, "error", "Usuario no encontrado");
    }

    await Profile.findOneAndDelete({ user: user._id });

    return respond(res, 200, "success", "Usuario eliminado correctamente", user);
  } catch (error) {
    return respond(res, 400, "error", "No se pudo eliminar el usuario");
  }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
