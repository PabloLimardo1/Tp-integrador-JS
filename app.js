// app.js
// Archivo principal de la aplicación.
// Se eligió "app.js" (en vez de index.js) porque es la convención más común
// en proyectos Express cuando el archivo representa específicamente la
// configuración de la app (middlewares, rutas) y no solo el punto de entrada.

require("dotenv").config(); // Carga las variables de entorno definidas en .env

const express = require("express");
const path = require("path");

const logger = require("./middlewares/logger");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware propio: registra cada visita en logs/log.txt
app.use(logger);

// Middleware de Express: sirve archivos estáticos (html, css, imágenes) desde /public
app.use(express.static(path.join(__dirname, "public")));

// Middleware para poder leer JSON en el body de futuras peticiones (Módulo 8)
app.use(express.json());

// Conectamos el router externo con app.use()
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
