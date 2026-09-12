# TP Integrador JS - Módulo 6

Aplicación backend con Node.js y Express. Primera etapa del proyecto: estructura del servidor, rutas, contenido estático y persistencia básica en archivos planos.

## Requisitos del sistema

- Node.js v18 o superior
- npm (incluido con Node.js)

## Instalación

1. Cloná el repositorio:
   ```bash
   git clone <URL-del-repo>
   cd tp-integrador-js
   ```
2. Instalá las dependencias:
   ```bash
   npm install
   ```
3. Creá un archivo `.env` en la raíz con el siguiente contenido (o usá el que ya viene incluido):
   ```
   PORT=3000
   ```

## Ejecución

- Modo desarrollo (con recarga automática usando nodemon):
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

## Módulo 7 - Base de datos, ORM y relaciones

### Base de datos y ORM elegidos

Se utilizó **MongoDB** (base de datos documental) junto con **Mongoose** como ODM/ORM, alojado en un clúster gratuito de MongoDB Atlas. Se eligió esta combinación por sobre PostgreSQL/Sequelize porque no requiere instalar ni administrar un servidor de base de datos local, lo que simplifica la puesta en marcha del proyecto en cualquier equipo.

Para conectarte a tu propia base de datos, agregá tu cadena de conexión en el archivo `.env`:
```
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombreDB
```

### Entidades y relaciones

| Entidad | Relación | Descripción |
|---------|----------|-------------|
| `User` ↔ `Profile` | 1:1 | Cada usuario tiene un único perfil asociado (campo `user` con índice único en `Profile`). |
| `User` ↔ `Post` | 1:N | Un usuario puede tener muchos posts; cada post pertenece a un único autor (`author` en `Post`). |
| `Post` ↔ `Tag` | N:M | Un post puede tener varias etiquetas, y una etiqueta puede pertenecer a varios posts (`tags` como array de referencias en `Post`). |

### Endpoints de la API

Todas las respuestas siguen el formato consistente `{ status, message, data }`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/users` | Crear usuario |
| GET | `/api/users` | Listar usuarios (soporta `?name=texto` para búsqueda filtrada) |
| GET | `/api/users/:id` | Obtener un usuario junto con su perfil |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario (y su perfil asociado) |
| POST | `/api/profiles` | Crear el perfil de un usuario (body: `{ bio, avatarUrl, user }`) |
| PUT | `/api/profiles/:userId` | Actualizar el perfil de un usuario |
| POST | `/api/posts` | Crear post (body: `{ title, content, author, tags: ["tag1","tag2"] }`) |
| GET | `/api/posts` | Listar posts (soporta `?title=texto`, `?author=idUsuario`, `?tag=nombre`) |
| GET | `/api/posts/:id` | Obtener un post por ID |
| PUT | `/api/posts/:id` | Actualizar post |
| DELETE | `/api/posts/:id` | Eliminar post |

### Validaciones y manejo de errores

- Campos obligatorios y formato de email validados a nivel de schema (Mongoose).
- Emails y nombres de etiquetas únicos, con respuesta `409` clara si ya existen.
- IDs inválidos o recursos inexistentes devuelven `400`/`404` con mensaje descriptivo en vez de un error genérico del servidor.

## Próximos pasos (Módulo 8)

- API RESTful con autenticación JWT y subida de archivos.
