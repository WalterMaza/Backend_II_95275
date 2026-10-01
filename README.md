# Clase 3: Login, JWT y sesión de usuario

## Descripción del Proyecto

Este proyecto es una API REST desarrollada con Node.js y Express como parte del Curso de Programación Backend II. Implementa un sistema de autenticación de usuarios utilizando JSON Web Tokens (JWT) y cookies para el manejo de sesiones. La aplicación permite el registro de usuarios, login, verificación de autenticación y cierre de sesión, conectándose a una base de datos MongoDB mediante Mongoose.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT (jsonwebtoken)** - Generación y verificación de tokens
- **bcryptjs** - Hashing de contraseñas
- **cookie-parser** - Middleware para parseo de cookies

## Estructura del Proyecto

```
src/
├── app.js                      # Punto de entrada de la aplicación
├── config/
│   ├── db.js                   # Configuración de conexión a MongoDB
│   └── env.js                  # Configuración de variables de entorno
├── controllers/
│   └── sessions.controller.js  # Controladores de autenticación
├── middlewares/
│   └── auth.middleware.js      # Middleware de autenticación
├── models/
│   └── user.model.js           # Modelo de usuario
├── routes/
│   └── sessions.router.js      # Rutas de autenticación
└── utils/
    ├── hash.js                 # Utilidades de hashing
    └── jwt.js                  # Utilidades de JWT
```

## Temas Vistos en la Clase

### Login, JWT y Sesión de Usuario

En esta clase implementamos un sistema completo de autenticación basado en JWT (JSON Web Tokens). Los conceptos clave abordados son:

- **JWT (JSON Web Token)**: Token compacto y seguro que permite transmitir información entre partes de forma verificable. Contiene un payload con datos del usuario y está firmado digitalmente.
- **Cookie**: Mecanismo para almacenar el token en el navegador del cliente, enviándose automáticamente en cada petición HTTP.
- **Sesión de usuario**: Estado de autenticación mantenido mediante el token almacenado en la cookie.
- **Middleware de autenticación**: Función intermedia que verifica la validez del token antes de permitir acceso a rutas protegidas.

## Implementación del Código

### 1. Creación de Cookie con Token

En el controller `login` (`src/controllers/sessions.controller.js`), tras validar las credenciales del usuario, se genera un JWT y se almacena en una cookie:

```javascript
// Genero el token utilizando la funcion ubicada en /utils/jwt.js
let token = generateToken(tokenUser)

// Creo la cookie con el token dentro, la cual será enviada al navegador junto con la respuesta HTTP
res.cookie("mi_cookie",
  token,
  {
    httpOnly: true,           // La cookie no es accesible desde JavaScript del cliente (seguridad XSS)
    maxAge: 24 * 60 * 60 * 1000 // 24 horas de duración
  }
)
```

La cookie se configura con `httpOnly: true` para prevenir ataques XSS, ya que no puede ser accedida mediante JavaScript del lado del cliente.

### 2. Ruta `/current`

La ruta `/current` (`src/routes/sessions.router.js`) es una ruta protegida que devuelve la información del usuario actualmente autenticado:

```javascript
// Ruta protegida
// Solo se accede al controller si el usuario esta autenticado
// la protección la proporciona la función authMiddleware
router.get('/current', authMiddleware, current);
```

Esta ruta utiliza el middleware `authMiddleware` para verificar que el usuario esté autenticado antes de ejecutar el controller.

### 3. Middleware de Autenticación

La función `authMiddleware` (`src/middlewares/auth.middleware.js`) es la encargada de verificar si el usuario está autenticado. Su funcionamiento es:

1. **Extrae el token de la cookie**: Obtiene el token almacenado en `req.cookies.mi_cookie`
2. **Verifica el token**: Utiliza la función `verifyToken` para validar que el token no haya expirado y que su firma sea válida
3. **Asigna datos del usuario a req**: Si el token es válido, los datos del usuario decodificados se asignan a `req.user`
4. **Pasa al siguiente middleware/controller**: Llama a `next()` para continuar con el flujo de la petición

```javascript
export const authMiddleware = (req, res, next) => {
    try {
        // 1. Extraemos el token de la cookie
        const token = req.cookies.mi_cookie

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No autenticado'
            })
        }

        // 2. Verificamos si el token es válido
        const decoded = verifyToken(token)

        // 3. Asignamos los datos del usuario al objeto req
        req.user = decoded

        // 4. Pasamos el control al controller
        next()
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Token inválido o expirado'
        })
    }
}
```

### 4. Controller `current`

El controller `current` (`src/controllers/sessions.controller.js`) simplemente devuelve la información del usuario autenticado que fue cargada en `req.user` por el middleware:

```javascript
export const current = (req, res) => {
  res.json({ status: 'success', message: 'Usuario autenticado', user: req.user });
}
```

Este controller recibe los datos del usuario ya decodificados del token, gracias a que el middleware `authMiddleware` los asignó a `req.user`.

### 5. Ruta `/logout`

La ruta `/logout` (`src/routes/sessions.router.js`) permite al usuario cerrar su sesión:

```javascript
// Cierre de sesión
router.post('/logout', logout);
```

El controller `logout` (`src/controllers/sessions.controller.js`) elimina la cookie que contiene el token:

```javascript
export const logout = (req, res) => {
  // Eliminamos la cookie que contiene el token
  res.clearCookie('mi_cookie');
  
  // Respondo al cliente con un mensaje de exito
  res.json({ status: 'success', message: 'Logout exitoso' });
}
```

Al eliminar la cookie, el token deja de enviarse en las peticiones subsiguientes, cerrando efectivamente la sesión del usuario.

## Cómo Probar con Postman

### 1. Registro de Usuario

- **Método**: POST
- **URL**: `http://localhost:PUERTO/api/sessions/register`
- **Body** (JSON):
```json
{
  "first_name": "Juan",
  "last_name": "Perez",
  "email": "juan@example.com",
  "password": "password123"
}
```

### 2. Login

- **Método**: POST
- **URL**: `http://localhost:PUERTO/api/sessions/login`
- **Body** (JSON):
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Importante**: Al hacer login, la respuesta incluirá una cookie llamada `mi_cookie` con el token JWT. Postman guardará automáticamente esta cookie para las siguientes peticiones.

### 3. Verificar Usuario Actual (`/current`)

- **Método**: GET
- **URL**: `http://localhost:PUERTO/api/sessions/current`

Esta ruta está protegida. Si la cookie con el token está presente y válida, devolverá los datos del usuario. Si no hay cookie o el token es inválido, retornará error 401.

### 4. Logout

- **Método**: POST
- **URL**: `http://localhost:PUERTO/api/sessions/logout`

Esta ruta eliminará la cookie. Después del logout, intentar acceder a `/current` retornará error 401.

## Configuración del Entorno

Crear un archivo `.env` basado en `.env.example`:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/biblioteca
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=24h
```

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm start
```

## Endpoints Disponibles

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/api/sessions/register` | Registro de nuevo usuario | No |
| POST | `/api/sessions/login` | Login de usuario | No |
| GET | `/api/sessions/current` | Obtener usuario actual | Sí |
| POST | `/api/sessions/logout` | Cerrar sesión | No |
| GET | `/health` | Health check | No |
