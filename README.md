# TP Integrador JS - Módulo 6

Aplicación backend con Node.js y Express. Primera etapa del proyecto: estructura del servidor, rutas, contenido estático y persistencia básica en archivos planos.

## Requisitos del sistema

- Node.js v18 o superior
- npm (incluido con Node.js)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL-del-repo>
   cd tp-integrador-js
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz con el siguiente contenido
   ```
   PORT=3000
   ```

## Ejecución

- Modo desarrollo:
  ```bash
  npm run dev
  ```
- Modo producción:
  ```bash
  npm start
  ```

El servidor queda disponible en `http://localhost:3000`.

## Rutas disponibles

| Ruta      | Método | Descripción                              | Formato |
|-----------|--------|-------------------------------------------|---------|
| `/`       | GET    | Página principal (contenido estático)     | HTML    |
| `/status` | GET    | Estado del servidor                       | JSON    |

## Estructura del proyecto

```
tp-integrador-js/
├── app.js                 # Archivo principal del servidor
├── routes/
│   └── index.js            # Definición de rutas
├── controllers/
│   └── mainController.js   # Lógica de cada ruta
├── middlewares/
│   └── logger.js            # Middleware de persistencia en archivo plano
├── public/
│   ├── index.html           # Vista estática
│   └── style.css
├── logs/
│   └── log.txt               # Registro de accesos (fecha, hora, ruta)
├── .env
├── .gitignore
└── package.json
```

## Justificación de decisiones técnicas

- **Nombre del archivo principal (`app.js` vs `index.js`)**: se eligió `app.js` porque representa específicamente la configuración de la aplicación Express (middlewares, rutas), separando esa responsabilidad de un futuro punto de entrada distinto si el proyecto creciera (por ejemplo, para tests).
- **Estructura de carpetas**: se organizó en `routes`, `controllers` y `middlewares` para separar responsabilidades siguiendo el patrón habitual en proyectos Express: las rutas solo mapean URLs a funciones, los controladores contienen la lógica, y los middlewares manejan tareas transversales (como el logging).
- **Router externo (`routes/index.js`)**: en vez de definir las rutas directamente en `app.js`, se extrajeron a un archivo separado conectado con `app.use()`, lo que facilita escalar el proyecto cuando se agreguen más rutas en los Módulos 7 y 8.
- **Persistencia en archivo plano**: se registran todos los accesos (no solo errores) para tener una traza completa del uso del servidor, usando `fs.appendFile()` para no sobrescribir el historial existente.
- **Contenido estático**: se utilizó la carpeta `/public` con `express.static()` en vez de un motor de plantillas, dado que en esta primera etapa el contenido no requiere lógica dinámica en el servidor; se evalúa incorporar EJS en etapas posteriores si se necesitan vistas dinámicas.

