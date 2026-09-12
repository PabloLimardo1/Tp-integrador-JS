// models/Post.js
// Relación 1:N con User (cada post tiene UN autor, un usuario puede tener muchos posts)
// Relación N:M con Tag (un post puede tener varias etiquetas, y una etiqueta puede estar en varios posts)

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
