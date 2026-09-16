# Programación Backend II - Clase 1

Proyecto backend desarrollado como parte de la **Clase 1 del Curso de Programación Backend II**. Este proyecto implementa una API RESTful para la gestión de un sistema de eventos, utilizando Node.js, Express y MongoDB con una arquitectura modular que incluye rutas, controladores, modelos y middlewares.

## Temática del Proyecto

Sistema de gestión de eventos que permite la creación y consulta de eventos. El proyecto está diseñado como base para desarrollar funcionalidades adicionales como gestión de usuarios, sesiones y tickets.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **dotenv** - Gestión de variables de entorno
- **nodemon** - Herramienta de desarrollo para reiniciar automáticamente el servidor

## Instalación

1. Clonar el repositorio
2. Instalar las dependencias:

```bash
npm install
```

## Configuración

1. Copiar el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Configurar las variables de entorno en el archivo `.env`:

```
PORT=8080
MONGO_URL=tu_url_de_mongodb
```

## Uso

### Modo Desarrollo

Para iniciar el servidor en modo desarrollo con reinicio automático:

```bash
npm run dev
```

El servidor se iniciará en el puerto 8080 (o el puerto configurado en `.env`).

## Estructura de Carpetas

```
.
├── src/
│   ├── app.js              # Configuración principal de Express
│   ├── server.js           # Punto de entrada del servidor
│   ├── config/
│   │   └── database.js     # Conexión a MongoDB
│   ├── controllers/
│   │   ├── events.controller.js   # Controlador de eventos
│   │   ├── sessions.controller.js # Controlador de sesiones (pendiente)
│   │   ├── tickets.controller.js  # Controlador de tickets (pendiente)
│   │   └── users.controller.js   # Controlador de usuarios (pendiente)
│   ├── midlewares/
│   │   └── example.middelware.js  # Middleware de ejemplo
│   ├── models/
│   │   ├── event.model.js         # Modelo de evento (pendiente)
│   │   ├── ticket.model.js        # Modelo de ticket (pendiente)
│   │   └── user.model.js          # Modelo de usuario
│   ├── routes/
│   │   ├── events.routes.js       # Rutas de eventos
│   │   ├── sessions.routes.js     # Rutas de sesiones (pendiente)
│   │   ├── tickets.routes.js      # Rutas de tickets (pendiente)
│   │   └── users.routes.js        # Rutas de usuarios (pendiente)
│   └── utils/             # Utilidades y funciones auxiliares
├── .env                   # Variables de entorno (no versionado)
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore             # Archivos ignorados por Git
├── package.json           # Dependencias y scripts
└── README.md              # Documentación del proyecto
```

## Rutas Disponibles

### Eventos

- `GET /api/events` - Obtener todos los eventos
- `POST /api/events` - Crear un nuevo evento

### Rutas Pendientes de Implementación

Las siguientes rutas están preparadas en la estructura del proyecto pero aún no están implementadas:

- **Usuarios** (`/api/users`)
  - `GET /api/users` - Obtener todos los usuarios
  - `POST /api/users` - Crear un nuevo usuario
  - `GET /api/users/:id` - Obtener un usuario por ID
  - `PUT /api/users/:id` - Actualizar un usuario
  - `DELETE /api/users/:id` - Eliminar un usuario

- **Sesiones** (`/api/sessions`)
  - `POST /api/sessions/login` - Iniciar sesión
  - `POST /api/sessions/logout` - Cerrar sesión
  - `POST /api/sessions/register` - Registrar usuario

- **Tickets** (`/api/tickets`)
  - `GET /api/tickets` - Obtener todos los tickets
  - `POST /api/tickets` - Crear un nuevo ticket
  - `GET /api/tickets/:id` - Obtener un ticket por ID

## Notas

- El proyecto utiliza módulos ES (`type: "module"` en package.json)
- La conexión a MongoDB se establece automáticamente al iniciar el servidor

## Seguimiento de Directorios Vacíos en Git (en respuesta a una consulta durante la clase en vivo)

Git no rastrea directorios vacíos por defecto. En el caso de necesitar preservar la estructura de carpetas (vacías) en un repositorio, se utilizan dos métodos:

### Método .gitkeep (Convención)

Se crea un archivo vacío llamado `.gitkeep` dentro de la carpeta. Git detecta el archivo y preserva la estructura en el repositorio. Cualquier contenido futuro que se agregue a la carpeta sí será rastreado. Este método es ideal para carpetas de código base como `controllers/`, `models/`, `routes/`, etc.

### Método .gitignore con ! (Nativo)

Se crea un archivo `.gitignore` dentro de la carpeta con las reglas:
```
*
!.gitignore
```

El directorio se sube al repositorio, pero todo contenido futuro será ignorado. Este método es ideal para carpetas que deben mantener su estructura pero no rastrear su contenido, como `logs/`, `cache/` o directorios temporales.