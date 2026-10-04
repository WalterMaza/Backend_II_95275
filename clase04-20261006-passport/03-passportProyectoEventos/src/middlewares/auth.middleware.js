import { verifyToken } from "../utils/jwt.js";


// Función en la cual:
// 1) Se extrae el token que está dentro de la cookie
// 2) Se verifica el token
// 3) Si el token es válido, extrae los datos del usuario y los asigna al objeto req
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

        // 2. Verificamos si el token es válido ( si expiró o su firma es inválida)
        // y extraemos su contenido
        const decoded = verifyToken(token)


        // 3. Asignamos los datos del usuario al objeto req y dichos datos quedaran disponibles
        // para que los utilice el controller
        req.user = decoded


        // Finalmente, llamamos a next() para pasar el control al controller
        // En las funciones middleware, next() es una función propia de Express
        // que se ejecuta para pasar el control al controller,
        // en este caso, cuando la verificación del token es exitosa
        next()

    } catch (error) {

        return res.status(401).json({
            status: 'error',
            message:
            'Token inválido o expirado'
        })

    }

}