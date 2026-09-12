// models/User.js
// Entidad principal. Relación 1:N con Post (un usuario tiene muchos posts)
// y relación 1:1 con Profile (un usuario tiene un solo perfil).

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "El email no tiene un formato válido"],
    },
  },
  { timestamps: true } // agrega createdAt y updatedAt automáticamente
);

module.exports = mongoose.model("User", userSchema);
