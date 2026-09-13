// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const requireAuth = require("../middlewares/auth");

// Rutas protegidas: crear y eliminar un post requiere estar autenticado
router.post("/", requireAuth, postController.createPost);
router.delete("/:id", requireAuth, postController.deletePost);

// Rutas públicas: cualquiera puede leer los posts
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);

module.exports = router;
