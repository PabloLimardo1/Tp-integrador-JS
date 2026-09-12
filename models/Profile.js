// models/Profile.js
// Relación 1:1 con User: cada perfil pertenece a un único usuario,
// y ese usuario tiene un único perfil (se garantiza con "unique" en la referencia).

const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      maxlength: [300, "La biografía no puede superar los 300 caracteres"],
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // clave para que la relación sea 1:1 y no 1:N
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
