// config/db.js
// Módulo 7: conexión a la base de datos MongoDB usando Mongoose (ORM/ODM).
// Se centraliza la conexión acá para poder invocarla una sola vez desde app.js.

const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error(
        "No se encontró MONGO_URI en las variables de entorno. Revisá tu archivo .env"
      );
    }

    await mongoose.connect(uri);
    console.log("Conexión a MongoDB establecida correctamente");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1); // Detiene la app si no hay conexión a la base de datos
  }
}

module.exports = connectDB;
