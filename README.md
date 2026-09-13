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
3. Crea un archivo `.env` en la raíz con el siguiente contenido (o usá el que ya viene incluido):
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

## Módulo 8 - API RESTful, JWT y subida de archivos

### Autenticación con JWT

Se implementó autenticación basada en tokens (JSON Web Tokens). El flujo es:

1. El usuario se registra en `POST /api/auth/register` (con `name`, `email`, `password`) o inicia sesión en `POST /api/auth/login` (con `email`, `password`).
2. El servidor responde con un `token` firmado, válido por 1 día.
3. Para acceder a una ruta protegida, el cliente debe enviar ese token en el header:
   ```
   Authorization: Bearer <token>
   ```
4. El middleware `middlewares/auth.js` valida que el token exista, no esté vencido y sea válido antes de dejar pasar la petición.

**El token no se almacena en el servidor** (JWT es un esquema stateless): el cliente es responsable de guardarlo (por ejemplo en `localStorage` en una app real) y enviarlo en cada petición a una ruta protegida.

**¿Por qué se protegieron esas rutas?** Se protegieron las operaciones que modifican datos de forma sensible: crear un post (`POST /api/posts`, para que quede asociado a un usuario autenticado y no a cualquiera), eliminar un post (`DELETE /api/posts/:id`) y eliminar un usuario (`DELETE /api/users/:id`). Las lecturas (`GET`) se dejaron públicas, ya que no representan un riesgo de integridad de datos.

### Rutas protegidas (requieren token válido)

| Método | Ruta | Motivo |
|--------|------|--------|
| POST | `/api/posts` | Solo un usuario autenticado puede publicar contenido |
| DELETE | `/api/posts/:id` | Evita que cualquiera borre contenido ajeno |
| DELETE | `/api/users/:id` | Evita que cualquiera elimine cuentas de usuario |
| POST | `/api/upload` | Solo usuarios autenticados pueden subir archivos al servidor |

Si intentás acceder a estas rutas sin el header `Authorization`, o con un token inválido/vencido, la API responde `401 Unauthorized` con un mensaje descriptivo.

### Subida de archivos

Se utilizó **multer** para manejar la subida de archivos:

- Endpoint: `POST /api/upload` (protegido con JWT), con el archivo enviado en un campo `file` (form-data).
- Los archivos se guardan en la carpeta `uploads/`, con un nombre único (timestamp) para evitar colisiones.
- Se valida el **tipo de archivo** (solo `jpg`, `jpeg`, `png`, `gif`) y el **tamaño máximo** (2MB); si no cumple, se responde con un error `400`.
- Los archivos quedan accesibles públicamente en `http://localhost:3000/uploads/nombre-del-archivo.jpg`.
- **Tarea PLUS**: si se envía un `userId` junto con el archivo, este se vincula automáticamente como `avatarUrl` en el `Profile` de ese usuario.

### Endpoints completos de la API

| Método | Ruta | Protegida | Descripción |
|--------|------|:---------:|-------------|
| POST | `/api/auth/register` | No | Registrar un usuario nuevo |
| POST | `/api/auth/login` | No | Iniciar sesión y obtener un token |
| GET | `/api/users` | No | Listar usuarios (`?name=` filtra por nombre) |
| GET | `/api/users/:id` | No | Obtener un usuario con su perfil |
| PUT | `/api/users/:id` | No | Actualizar usuario |
| DELETE | `/api/users/:id` | **Sí** | Eliminar usuario |
| POST | `/api/profiles` | No | Crear el perfil de un usuario |
| PUT | `/api/profiles/:userId` | No | Actualizar el perfil de un usuario |
| GET | `/api/posts` | No | Listar posts (`?title=`, `?author=`, `?tag=` filtran resultados) |
| GET | `/api/posts/:id` | No | Obtener un post por ID |
| POST | `/api/posts` | **Sí** | Crear un post |
| PUT | `/api/posts/:id` | No | Actualizar un post |
| DELETE | `/api/posts/:id` | **Sí** | Eliminar un post |
| POST | `/api/upload` | **Sí** | Subir un archivo (imagen) |

### Cómo probar la autenticación (ejemplo con curl)

```bash
# 1. Registrarse
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ana\",\"email\":\"ana@ejemplo.com\",\"password\":\"123456\"}"

# 2. Copiar el "token" de la respuesta y usarlo en una ruta protegida
curl -X DELETE http://localhost:3000/api/posts/ID_DEL_POST \
  -H "Authorization: Bearer PEGAR_TOKEN_AQUI"
```

### Justificación de decisiones técnicas

- **Separación de rutas/controladores/middlewares**: se mantuvo la misma arquitectura modular de los módulos anteriores, agregando `authController`, `uploadController` y los middlewares `auth.js` y `upload.js`, sin mezclar responsabilidades.
- **Validaciones antes de insertar/modificar datos**: se valida que `name`, `email` y `password` estén presentes en el registro; el modelo `User` valida formato de email y longitud mínima de contraseña a nivel de schema; en la subida de archivos se valida tipo (extensión y mimetype) y tamaño máximo.
- **Almacenamiento del token**: el servidor no guarda el token en ningún lado (es stateless); solo lo firma y lo verifica. Es responsabilidad del cliente guardarlo y reenviarlo.
