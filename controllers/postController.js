// controllers/postController.js
// CRUD completo sobre la entidad Post, con manejo de errores, validaciones
// y consultas filtradas/dinámicas.

const Post = require("../models/Post");
const Tag = require("../models/Tag");

function respond(res, statusCode, status, message, data = null) {
  return res.status(statusCode).json({ status, message, data });
}

// Recibe un array de nombres de tags (strings) y devuelve los ObjectId
// correspondientes, creando en la base los que todavía no existan.
async function resolveTags(tagNames = []) {
  const tagIds = [];
  for (const rawName of tagNames) {
    const name = rawName.trim().toLowerCase();
    if (!name) continue;
    const tag = await Tag.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true }
    );
    tagIds.push(tag._id);
  }
  return tagIds;
}

// CREATE - Crear un post
async function createPost(req, res) {
  try {
    const { title, content, author, tags } = req.body;
    const tagIds = await resolveTags(tags);

    const post = await Post.create({ title, content, author, tags: tagIds });
    return respond(res, 201, "success", "Post creado correctamente", post);
  } catch (error) {
    if (error.name === "ValidationError") {
      return respond(res, 400, "error", error.message);
    }
    return respond(res, 500, "error", "Error interno al crear el post");
  }
}

// READ - Listar posts con búsqueda filtrada/dinámica:
// ?title=palabra       -> busca por coincidencia parcial en el título
// ?author=<idDeUsuario> -> filtra posts de un autor específico
// ?tag=nombreDeTag      -> filtra posts que tengan una etiqueta específica
async function getPosts(req, res) {
  try {
    const { title, author, tag } = req.query;
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (author) {
      filter.author = author;
    }
    if (tag) {
      const tagDoc = await Tag.findOne({ name: tag.toLowerCase() });
      // Si la etiqueta no existe, se filtra por un id inexistente para devolver lista vacía
      filter.tags = tagDoc ? tagDoc._id : null;
    }

    const posts = await Post.find(filter)
      .populate("author", "name email") // trae los datos del usuario relacionado
      .populate("tags", "name"); // trae los nombres de las etiquetas relacionadas

    return respond(res, 200, "success", "Posts obtenidos correctamente", posts);
  } catch (error) {
    return respond(res, 500, "error", "Error interno al obtener los posts");
  }
}

// READ - Obtener un post por ID
async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("tags", "name");

    if (!post) {
      return respond(res, 404, "error", "Post no encontrado");
    }

    return respond(res, 200, "success", "Post obtenido correctamente", post);
  } catch (error) {
    return respond(res, 400, "error", "ID de post inválido");
  }
}

// UPDATE - Actualizar un post
async function updatePost(req, res) {
  try {
    const { tags, ...rest } = req.body;
    const updateData = { ...rest };

    if (tags) {
      updateData.tags = await resolveTags(tags);
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("author", "name email")
      .populate("tags", "name");

    if (!post) {
      return respond(res, 404, "error", "Post no encontrado");
    }

    return respond(res, 200, "success", "Post actualizado correctamente", post);
  } catch (error) {
    if (error.name === "ValidationError") {
      return respond(res, 400, "error", error.message);
    }
    return respond(res, 400, "error", "No se pudo actualizar el post");
  }
}

// DELETE - Eliminar un post
async function deletePost(req, res) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return respond(res, 404, "error", "Post no encontrado");
    }
    return respond(res, 200, "success", "Post eliminado correctamente", post);
  } catch (error) {
    return respond(res, 400, "error", "No se pudo eliminar el post");
  }
}

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
