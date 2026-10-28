# Sistema de Gestión de Eventos y Tickets

**Curso:** Programación Backend II  
**Clase 7:** Tickets, inscripciones y relaciones prolijas

Este proyecto es una API REST para la gestión de eventos y tickets, desarrollada con Node.js, Express y MongoDB. Implementa un sistema completo de autenticación, autorización por roles, y gestión de reservas para eventos.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Sistema de Tickets](#sistema-de-tickets)
  - [Modelo de Ticket](#modelo-de-ticket)
  - [Controlador de Tickets](#controlador-de-tickets)
  - [Rutas de Tickets](#rutas-de-tickets)
- [Pruebas con Postman](#pruebas-con-postman)

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Passport** - Middleware de autenticación
- **JWT** - JSON Web Tokens para autenticación
- **bcryptjs** - Encriptación de contraseñas

## 📦 Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno en `.env`:
```env
MONGO_URL=tu_url_de_mongodb
PORT=8080
JWT_SECRET=tu_secreto_jwt
```

4. Iniciar el servidor:
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
clase06-Events/
├── src/
│   ├── config/           # Configuración (DB, Passport, Variables de entorno)
│   ├── controller/       # Lógica de negocio
│   ├── dao/             # Modelos de Mongoose
│   ├── middleware/      # Middlewares personalizados
│   ├── routes/          # Definición de rutas
│   ├── utils/           # Utilidades y helpers
│   └── app.js           # Punto de entrada de la aplicación
├── .env                 # Variables de entorno
├── package.json         # Dependencias del proyecto
└── README.md           # Documentación
```

## 🎫 Sistema de Tickets

El sistema de tickets permite a los usuarios registrarse para eventos, gestionar sus reservas y cancelar inscripciones. Esta sección detalla la implementación completa del módulo de tickets.

### Modelo de Ticket

**Archivo:** `src/dao/models/ticketModel.js`

El modelo de Ticket define la estructura de los tickets en la base de datos con las siguientes propiedades:

```javascript
const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    status: {
        type: String,
        enum: ["confirmed", "pending", "cancelled"],
        default: "confirmed"
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    reservationCode: {
        type: String,
        required: false,
        unique: true
    },
    canccelledAt: {
        type: Date,
        default: null
    }
})
```

**Propiedades del Modelo:**

- **user**: Referencia al usuario que compra el ticket (ObjectId → User)
- **event**: Referencia al evento para el cual se compra el ticket (ObjectId → Event)
- **status**: Estado del ticket (confirmed/pending/cancelled). Por defecto: "confirmed"
- **quantity**: Cantidad de entradas reservadas. Mínimo: 1, por defecto: 1
- **reservationCode**: Código único de reserva generado automáticamente (formato: TCK-XXXXXXXXX)
- **canccelledAt**: Fecha de cancelación del ticket (null si no está cancelado)

**Relaciones:**
- El ticket establece una relación many-to-one con User (muchos tickets pueden pertenecer a un usuario)
- El ticket establece una relación many-to-one con Event (muchos tickets pueden pertenecer a un evento)

### Controlador de Tickets

**Archivo:** `src/controller/tickets.controller.js`

El controlador implementa la lógica de negocio para todas las operaciones relacionadas con tickets.

#### 1. Crear Ticket (`createTicket`)

**Endpoint:** POST `/api/tickets`

**Validaciones implementadas:**

1. **Existencia del evento:** Verifica que el evento exista en la base de datos
2. **Estado del evento:** Solo permite tickets para eventos con status "published"
3. **Fecha del evento:** No permite reservar tickets para eventos que ya pasaron
4. **Duplicidad:** Verifica que el usuario no tenga un ticket confirmado para el mismo evento
5. **Capacidad disponible:** Utiliza aggregation pipeline para calcular los lugares reservados y validar que haya suficiente capacidad

**Lógica de capacidad:**
```javascript
const result = await TicketModel.aggregate([
    {
        $match: {
            event: eventId,
            status: "confirmed"
        }
    },
    {
        $group: {
            _id: "$event",
            total: { $sum: "$quantity" }
        }
    }
])

const reserved = result[0]?.total || 0
const available = event.capacity - reserved
```

**Generación de código de reserva:**
Utiliza la utilidad `generateTicketCode()` para generar un código único en formato `TCK-XXXXXXXXX`.

**Respuesta:**
- **201 Created:** Ticket creado exitosamente
- **400 Bad Request:** Error de validación (evento no encontrado, no publicado, ya pasó, duplicado, sin capacidad)
- **500 Internal Server Error:** Error del servidor

#### 2. Obtener Tickets (`getTickets`)

**Endpoint:** GET `/api/tickets`

**Parámetros de query:**
- `status`: Filtrar por estado del ticket (confirmed/pending/cancelled)
- `eventId`: Filtrar por evento específico
- `page`: Número de página (por defecto: 1)
- `limit`: Cantidad de tickets por página (por defecto: 10)
- `sort`: Campo de ordenamiento (por defecto: 'createdAt')

**Características:**
- Implementa paginación con `skip()` y `limit()`
- Popula los campos `user` (first_name, last_name, email) y `event` (title, date, location)
- Retorna metadatos de paginación (total, page, limit, totalPages)
- Permite filtrado múltiple combinando status y eventId

**Respuesta:**
```json
{
  "status": "success",
  "payload": [/* array de tickets */],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### 3. Obtener Ticket por ID (`getTicketById`)

**Endpoint:** GET `/api/tickets/:tid`

**Parámetros de ruta:**
- `tid`: ID del ticket (ObjectId de MongoDB)

**Características:**
- Busca el ticket por su ID
- Popula información completa del usuario y del evento
- Incluye detalles adicionales del evento (capacity, price)

**Respuesta:**
- **200 OK:** Ticket encontrado con información completa
- **404 Not Found:** Ticket no existe
- **500 Internal Server Error:** Error del servidor

#### 4. Cancelar Ticket (`cancelTicket`)

**Endpoint:** PATCH `/api/tickets/:tid/cancel`

**Parámetros de ruta:**
- `tid`: ID del ticket a cancelar

**Validaciones implementadas:**

1. **Existencia del ticket:** Verifica que el ticket exista
2. **Estado actual:** No permite cancelar un ticket que ya está cancelado
3. **Existencia del evento:** Verifica que el evento asociado exista
4. **Fecha del evento:** No permite cancelar tickets de eventos que ya pasaron

**Lógica de cancelación:**
```javascript
ticket.status = "cancelled"
ticket.canccelledAt = new Date()
await ticket.save()
```

**Respuesta:**
- **200 OK:** Ticket cancelado exitosamente
- **400 Bad Request:** Ticket ya cancelado o evento ya pasó
- **404 Not Found:** Ticket o evento no encontrado
- **500 Internal Server Error:** Error del servidor

### Rutas de Tickets

**Archivo:** `src/routes/tickets.router.js`

Todas las rutas de tickets requieren autenticación mediante Passport JWT y autorización por roles.

```javascript
// Endpoint para obtener todos los tickets
router.get("/", passport.authenticate("current", { session: false }), 
           authorizeRoles("admin", "organizer", "user"), getTickets)

// Endpoint para obtener un ticket por su id
router.get("/:tid", passport.authenticate("current", { session: false }), 
           authorizeRoles("admin", "organizer", "user"), getTicketById)

// Endpoint para crear un ticket
router.post("/", passport.authenticate("current", { session: false }), 
            authorizeRoles("admin", "organizer", "user"), createTicket)

// Endpoint para cancelar un ticket
router.patch("/:tid/cancel", passport.authenticate("current", { session: false }), 
              authorizeRoles("admin", "organizer", "user"), cancelTicket)
```

**Middleware de autenticación:**
- `passport.authenticate("current", { session: false })`: Valida el token JWT y adjunta el usuario autenticado a `req.user`

**Middleware de autorización:**
- `authorizeRoles("admin", "organizer", "user")`: Verifica que el usuario tenga uno de los roles permitidos

**Roles permitidos:**
- **admin**: Acceso completo a todas las operaciones
- **organizer**: Puede crear y gestionar tickets
- **user**: Puede comprar y cancelar sus propios tickets

### Utilidades

**Archivo:** `src/utils/ticketCode.js`

Generador de códigos únicos de reserva:

```javascript
export const generateTicketCode = () => {
    const randomPart = Math.random()
        .toString(36)
        .substring(2, 15);
    
    return `TCK-${randomPart}`;
}
```

**Formato del código:** `TCK-` seguido de 12 caracteres alfanuméricos aleatorios.

**Ejemplos:**
- `TCK-a1b2c3d4e5f6`
- `TCK-x7y8z9w0q1r2`

## 🧪 Pruebas con Postman

A continuación se presentan las colecciones de Postman para probar los endpoints de tickets.

### Pre-requisitos

Antes de probar los endpoints de tickets, necesitas:

1. **Registrar un usuario** (POST `/api/sessions/register`)
2. **Iniciar sesión** (POST `/api/sessions/login`) para obtener el token JWT
3. **Crear un evento** (POST `/api/events`) - Requiere rol organizer o admin
4. **Configurar el token** en Postman: Header `Authorization: Bearer <tu_token>`

### 1. Crear Ticket

**Método:** POST  
**URL:** `http://localhost:8080/api/tickets`


**Body (JSON):**
```json
{
  "eventId": "675a1b2c3d4e5f6789a0b1c2",
  "quantity": 2
}
```

**Respuesta Exitosa (201):**
```json
{
  "status": "success",
  "payload": {
    "_id": "675a1b2c3d4e5f6789a0b1c3",
    "user": "675a1b2c3d4e5f6789a0b1c0",
    "event": "675a1b2c3d4e5f6789a0b1c2",
    "status": "confirmed",
    "quantity": 2,
    "reservationCode": "TCK-a1b2c3d4e5f6",
    "canccelledAt": null,
    "createdAt": "2026-10-28T10:30:00.000Z",
    "updatedAt": "2026-10-28T10:30:00.000Z",
    "__v": 0
  }
}
```

**Errores Comunes:**

- **404** - Evento no encontrado:
```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

- **400** - Evento no publicado:
```json
{
  "status": "error",
  "message": "El evento no está publicado"
}
```

- **400** - Evento ya pasó:
```json
{
  "status": "error",
  "message": "El evento ya pasó"
}
```

- **400** - Usuario ya tiene ticket:
```json
{
  "status": "error",
  "message": "El usuario ya tiene un ticket para este evento"
}
```

- **400** - Sin capacidad suficiente:
```json
{
  "status": "error",
  "message": "No hay suficientes lugares disponibles"
}
```

### 2. Obtener Todos los Tickets

**Método:** GET  
**URL:** `http://localhost:8080/api/tickets`


**Query Params (opcionales):**
- `status=confirmed` - Filtrar por estado
- `eventId=675a1b2c3d4e5f6789a0b1c2` - Filtrar por evento
- `page=1` - Número de página
- `limit=10` - Tickets por página
- `sort=createdAt` - Campo de ordenamiento

**Ejemplo con filtros:**
```
GET http://localhost:8080/api/tickets?status=confirmed&page=1&limit=5
```

**Respuesta Exitosa (200):**
```json
{
  "status": "success",
  "payload": [
    {
      "_id": "675a1b2c3d4e5f6789a0b1c3",
      "user": {
        "_id": "675a1b2c3d4e5f6789a0b1c0",
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan@example.com"
      },
      "event": {
        "_id": "675a1b2c3d4e5f6789a0b1c2",
        "title": "Concierto de Rock",
        "date": "2026-12-15T20:00:00.000Z",
        "location": "Estadio Nacional"
      },
      "status": "confirmed",
      "quantity": 2,
      "reservationCode": "TCK-a1b2c3d4e5f6",
      "canccelledAt": null,
      "createdAt": "2026-10-28T10:30:00.000Z",
      "updatedAt": "2026-10-28T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  }
}
```

### 3. Obtener Ticket por ID

**Método:** GET  
**URL:** `http://localhost:8080/api/tickets/:tid`


**Ejemplo:**
```
GET http://localhost:8080/api/tickets/675a1b2c3d4e5f6789a0b1c3
```

**Respuesta Exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "675a1b2c3d4e5f6789a0b1c3",
    "user": {
      "_id": "675a1b2c3d4e5f6789a0b1c0",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com"
    },
    "event": {
      "_id": "675a1b2c3d4e5f6789a0b1c2",
      "title": "Concierto de Rock",
      "date": "2026-12-15T20:00:00.000Z",
      "location": "Estadio Nacional",
      "capacity": 1000,
      "price": 50
    },
    "status": "confirmed",
    "quantity": 2,
    "reservationCode": "TCK-a1b2c3d4e5f6",
    "canccelledAt": null,
    "createdAt": "2026-10-28T10:30:00.000Z",
    "updatedAt": "2026-10-28T10:30:00.000Z"
  }
}
```

**Error (404):**
```json
{
  "status": "error",
  "message": "Ticket no encontrado"
}
```

### 4. Cancelar Ticket

**Método:** PATCH  
**URL:** `http://localhost:8080/api/tickets/:tid/cancel`


**Ejemplo:**
```
PATCH http://localhost:8080/api/tickets/675a1b2c3d4e5f6789a0b1c3/cancel
```

**Respuesta Exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "675a1b2c3d4e5f6789a0b1c3",
    "user": "675a1b2c3d4e5f6789a0b1c0",
    "event": "675a1b2c3d4e5f6789a0b1c2",
    "status": "cancelled",
    "quantity": 2,
    "reservationCode": "TCK-a1b2c3d4e5f6",
    "canccelledAt": "2026-10-28T11:00:00.000Z",
    "createdAt": "2026-10-28T10:30:00.000Z",
    "updatedAt": "2026-10-28T11:00:00.000Z",
    "__v": 0
  }
}
```

**Errores Comunes:**

- **404** - Ticket no encontrado:
```json
{
  "status": "error",
  "message": "Ticket no encontrado"
}
```

- **400** - Ticket ya cancelado:
```json
{
  "status": "error",
  "message": "El ticket ya está cancelado"
}
```

- **400** - Evento ya pasó:
```json
{
  "status": "error",
  "message": "No se puede cancelar un ticket de un evento que ya pasó"
}
```


**Variables de entorno en Postman:**
- `baseUrl`: URL base del servidor (http://localhost:8080)
- `token`: Token JWT obtenido al iniciar sesión
- `eventId`: ID del evento para el cual crear el ticket
- `ticketId`: ID del ticket para operaciones get/cancel

## 📝 Notas Adicionales

### Seguridad

- Todos los endpoints de tickets requieren autenticación JWT
- El middleware de autorización verifica que el usuario tenga los roles apropiados
- Los passwords se encriptan usando bcryptjs antes de almacenarse

### Buenas Prácticas Implementadas

1. **Validaciones exhaustivas:** Cada endpoint valida las precondiciones antes de ejecutar la operación
2. **Manejo de errores:** Respuestas HTTP apropiadas con mensajes descriptivos
3. **Populate de relaciones:** Las consultas incluyen información relacionada (user, event)
4. **Paginación:** Los listados implementan paginación para optimizar el rendimiento
5. **Códigos únicos:** Los tickets tienen códigos de reserva únicos generados automáticamente
6. **Control de capacidad:** El sistema valida la capacidad disponible antes de crear tickets

### Flujo Completo de Uso

1. Usuario se registra e inicia sesión
2. Usuario busca eventos disponibles (GET `/api/events`)
3. Usuario crea un ticket para un evento (POST `/api/tickets`)
4. Sistema valida capacidad, duplicidad y estado del evento
5. Sistema genera código de reserva único
6. Usuario puede consultar sus tickets (GET `/api/tickets`)
7. Usuario puede cancelar un ticket si el evento no ha pasado (PATCH `/api/tickets/:tid/cancel`)

## 🔗 Endpoints Relacionados

- **Eventos:** `/api/events` - Gestión de eventos
- **Sesiones:** `/api/sessions` - Autenticación y registro de usuarios
- **Categorías:** `/api/categories` - Gestión de categorías de eventos

## 📄 Licencia

Este proyecto es parte del material educativo del curso Programación Backend II.
