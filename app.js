// app.js
// Archivo principal de la aplicación.
// Se eligió "app.js" (en vez de index.js) porque es la convención más común
// en proyectos Express cuando el archivo representa específicamente la
// configuración de la app (middlewares, rutas) y no solo el punto de entrada.

require("dotenv").config(); // Carga las variables de entorno definidas en .env

const express = require("express");
const path = require("path");

const connectDB = require("./config/db");
const logger = require("./middlewares/logger");
const routes = require("./routes/index");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Módulo 7: conexión a la base de datos MongoDB antes de levantar el servidor
connectDB();

// Middleware propio: registra cada visita en logs/log.txt
app.use(logger);

// Middleware de Express: sirve archivos estáticos (html, css, imágenes) desde /public
app.use(express.static(path.join(__dirname, "public")));

// Módulo 8: hace accesibles públicamente los archivos subidos (ej: http://localhost:3000/uploads/foto.jpg)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware para poder leer JSON en el body de las peticiones (necesario para la API)
app.use(express.json());

// Rutas del Módulo 6 (contenido web estático/dinámico)
app.use("/", routes);

// Rutas del Módulo 7 (API con persistencia en base de datos)
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profiles", profileRoutes);

// Rutas del Módulo 8 (autenticación JWT y subida de archivos)
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
