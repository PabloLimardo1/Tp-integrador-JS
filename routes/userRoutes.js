// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require("../middlewares/auth");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);

// Ruta protegida: eliminar un usuario requiere estar autenticado
router.delete("/:id", requireAuth, userController.deleteUser);

module.exports = router;
