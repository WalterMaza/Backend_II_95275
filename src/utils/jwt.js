import jwt from "jsonwebtoken"

export const generateToken = user => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}


// Función que verifica si el token es valido en base a la firma ()
export const verifyToken = token => {
    return jwt.verify(token, process.env.JWT_SECRET)
}
