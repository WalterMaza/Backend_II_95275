# Programación Backend II - Clase 5: Roles y Autorización Profesional

Este proyecto pertenece a la **Clase 5** del curso de Programación Backend II, enfocada en la implementación de sistemas de **roles y autorización profesional** en nuestra Plataforma de Eventos.

## 📋 Descripción del Proyecto

API REST desarrollada con Express.js que implementa un sistema de autenticación basado en JWT y un sistema de autorización por roles para gestionar eventos. El proyecto demuestra cómo controlar el acceso a diferentes recursos según el rol del usuario autenticado.

### Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB + Mongoose** - Base de datos NoSQL y ODM
- **Passport.js** - Middleware de autenticación
- **JWT (JSON Web Tokens)** - Tokens de autenticación
- **bcryptjs** - Encriptación de contraseñas
- **cookie-parser** - Middleware para parsear cookies

## 🔐 Sistema de Roles y Autorización

### Roles Definidos

El sistema implementa tres roles jerárquicos en el modelo de usuario (`src/dao/models/userModel.js`):

- **user**: Usuario básico con permisos de lectura
- **organizer**: Organizador con permisos de creación y edición
- **admin**: Administrador con permisos completos

```javascript
role: {
    type: String,
    enum: ["user", "organizer", "admin"],
    default: "user"
}
```

### Middleware de Autorización por Roles

El middleware `authorizeRoles` (`src/middleware/authorization.middleware.js`) implementa el control de acceso basado en roles:

```javascript
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                status: "error",
                "message": "No tiene permisos para acceder a este recurso"
            })
        }
        next();
    }
}
```

**Funcionamiento:**
- Recibe una lista de roles permitidos como parámetros
- Verifica si el rol del usuario (`req.user.role`) está incluido en la lista
- Si no tiene permisos, retorna un error 403 (Forbidden)
- Si tiene permisos, continúa con el siguiente middleware

### Matriz de Permisos

Los permisos se aplican según la siguiente matriz para el recurso de eventos:

| Acción                 | user | organizer | admin |
|------------------------|------|-----------|-------|
| Consultar eventos      | ✔    | ✔         | ✔     |
| Crear eventos          | ✘    | ✔         | ✔     |
| Editar eventos         | ✘    | ✔         | ✔     |
| Eliminar eventos       | ✘    | ✘         | ✔     |
| Administrar usuarios   | ✘    | ✘         | ✔     |

### Implementación en el Router de Eventos

El router de eventos (`src/routes/events.router.js`) aplica el middleware de autorización en cada endpoint según la matriz de permisos:

```javascript
// GET /api/events - Todos los roles pueden consultar
router.get("/", 
    passport.authenticate("current", { session: false }), 
    authorizeRoles("admin", "organizer", "user"), 
    getEvents
)

// GET /api/events/:eid - Todos los roles pueden consultar por ID
router.get("/:eid", 
    passport.authenticate("current", { session: false }), 
    authorizeRoles("admin", "organizer", "user"), 
    getEventById
)

// PATCH /api/events/:eid - Solo organizer y admin pueden editar
router.patch("/:eid", 
    passport.authenticate("current", { session: false }), 
    authorizeRoles("admin", "organizer"), 
    updateEvent
)

// POST /api/events - Solo organizer y admin pueden crear
router.post("/", 
    passport.authenticate("current", { session: false }), 
    authorizeRoles("organizer", "admin"), 
    createEvent
)

// DELETE /api/events/:eid - Solo admin puede eliminar
router.delete("/:eid", 
    passport.authenticate("current", { session: false }), 
    authorizeRoles("admin"), 
    deleteEvent
)
```

**Flujo de autenticación y autorización:**
1. `passport.authenticate("current", { session: false })` - Valida el token JWT y extrae el usuario
2. `authorizeRoles(...)` - Verifica si el rol tiene permisos para la acción
3. Controller - Ejecuta la lógica del endpoint si pasó las validaciones

## 📁 Estructura del Proyecto

```
Backend_II_95275/
├── src/
│   ├── app.js                    # Punto de entrada de la aplicación
│   ├── config/
│   │   ├── db.js                 # Configuración de conexión a MongoDB
│   │   ├── env.js                # Variables de entorno
│   │   └── passport.config.js    # Estrategias de Passport (JWT, Local)
│   ├── controller/
│   │   ├── events.controller.js  # Controladores de eventos (placeholders)
│   │   └── sessions.controller.js # Controladores de autenticación
│   ├── dao/
│   │   ├── UsersDAO.js           # Data Access Object de usuarios
│   │   └── models/
│   │       └── userModel.js      # Modelo de usuario con roles
│   ├── middleware/
│   │   ├── authorization.middleware.js # Middleware de autorización por roles
│   │   └── errorHandler.js       # Middleware de manejo de errores
│   ├── routes/
│   │   ├── events.router.js      # Rutas de eventos con autorización
│   │   └── sessions.router.js    # Rutas de autenticación
│   └── utils/
│       ├── hash.js               # Utilidades de hash de contraseñas
│       └── jwt.js                # Utilidades de generación/verificación JWT
├── package.json
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js (v16 o superior)
- MongoDB (local o en la nube)

### Instalación

```bash
npm install
```

### Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/backend_ii_clase5
JWT_SECRET=tu_secreto_jwt_super_seguro
```

### Ejecución

**Modo desarrollo:**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor se iniciará en `http://localhost:8080`

## 🧪 Pruebas con Postman

### 1. Registro de Usuario

**POST** `http://localhost:8080/api/sessions/register`

```json
{
    "firstName": "Juan",
    "lastName": "Perez",
    "email": "juan@example.com",
    "password": "password123",
    "role": "user"
}
```

**Nota:** Puedes registrar usuarios con diferentes roles (`user`, `organizer`, `admin`) para probar los permisos.

### 2. Login

**POST** `http://localhost:8080/api/sessions/login`

```json
{
    "email": "juan@example.com",
    "password": "password123"
}
```

**Respuesta:** Recibirás una cookie con el token JWT.

### 3. Consultar Eventos (Todos los roles)

**GET** `http://localhost:8080/api/events`

**Headers:**
- Incluir la cookie con el token JWT recibido en el login

**Permitido para:** user, organizer, admin

### 4. Crear Evento (Organizer y Admin)

**POST** `http://localhost:8080/api/events`

**Headers:**
- Incluir la cookie con el token JWT

**Body:**
```json
{
    "title": "Evento de prueba",
    "description": "Descripción del evento",
    "date": "2026-12-31",
    "location": "Ubicación"
}
```

**Permitido para:** organizer, admin

**Error esperado con user:** 403 Forbidden

### 5. Editar Evento (Organizer y Admin)

**PATCH** `http://localhost:8080/api/events/:eid`

**Headers:**
- Incluir la cookie con el token JWT

**Body:**
```json
{
    "title": "Evento actualizado"
}
```

**Permitido para:** organizer, admin

**Error esperado con user:** 403 Forbidden

### 6. Eliminar Evento (Solo Admin)

**DELETE** `http://localhost:8080/api/events/:eid`

**Headers:**
- Incluir la cookie con el token JWT

**Permitido para:** admin

**Error esperado con user y organizer:** 403 Forbidden

### 7. Probar Error 403

Para verificar el middleware de autorización:

1. Login con un usuario con rol `user`
2. Intentar crear, editar o eliminar un evento
3. Deberías recibir:
```json
{
    "status": "error",
    "message": "No tiene permisos para acceder a este recurso"
}
```

## 🔜 Próximos Pasos

En próximas clases se mejorará la organización del proyecto a medida que avance en complejidad:

- Implementación completa de los controladores de eventos
- Persistencia de eventos en MongoDB
- Validaciones más robustas
- Mejor estructura de carpetas y separación de responsabilidades
- Implementación de permisos más granulares
- Documentación con Swagger/OpenAPI

## 📝 Notas Importantes

- Los controladores de eventos actualmente retornan `{ status: 'ok' }` como placeholders
- La autenticación se realiza mediante JWT cookies
- El middleware `authorizeRoles` es reutilizable para cualquier ruta que necesite control por roles
- El usuario se adjunta a `req.user` después de la autenticación con Passport

## 👥 Autores

Curso de Programación Backend II - Clase 5
