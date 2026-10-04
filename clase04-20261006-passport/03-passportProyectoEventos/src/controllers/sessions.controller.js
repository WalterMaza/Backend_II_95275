import { UserModel } from '../models/user.model.js';
import { createHash, validaPass } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const register = async (req, res) => {
  try {
    // nunca aceptar el role...!!!
    let {first_name, last_name, email, password} = req.body

    // validaciones pertinentes
    if(!first_name || !last_name || !email || !password){
      return res.status(400).json({error:`Faltan datos requeridos`})
    }    

    let emailNormalized=email.trim().toLowerCase()

    if(!EMAIL_REGEX.test(emailNormalized)){
      return res.status(400).json({error:`Email con formato invalido`})
    }

    if(password.trim().length<MIN_PASSWORD_LENGTH){
      return res.status(400).json({error:`La contraseña debe tener un tamaño mínimo de ${MIN_PASSWORD_LENGTH} caracteres`})
    }

    let existe=await UserModel.findOne({email: emailNormalized})
    if(existe){
      return res.status(409).json({error:`El email ${emailNormalized} ya existe en DB`})
    }

    let hashedPassword=await createHash(password)

    let user=await UserModel.create({first_name, last_name, email: emailNormalized, password: hashedPassword})

    // mas adelante será implementado con un DTO
    let {password:password1, __v, _id, createdAt, updatedAt, ...safeUser } = user.toJSON()
   

    return res.status(201).json({message:"Registro exitoso", user: safeUser});
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};


export const login = async(req, res)=>{
  try {

    let {email, password}=req.body

    if(!email || !password){
      return res.status(400).json({error:`email | password son requeridos`})
    }

    // Obtengo los datos de usuario buscandolo por su email
    let user = await UserModel.findOne({email}).lean()  // toJSON() / deshidrata el documento

    if(!user){
      return res.status(401).json({error:`Credenciales invalidas`})
    }

    if(!await validaPass(password, user.password)){
      return res.status(401).json({error:`Credenciales invalidas`})   
    }

    // Creo la estructura con los datos del usuario que voy a guardar dentro del token (JWT)
    // A lo datos los obtengo de la variable user  
    const tokenUser = {
      id: user._id,
      email: user.email,
      role: user.role
    }

    // Genero el token utilizando la funcion ubicada en /utils/jwt.js
    let token = generateToken(tokenUser)

    // Creo la cookie con el token dentro, la cual será enviada al navegador junto con la respuesta HTTP
    res.cookie( "mi_cookie",
      token,
      {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      }
    )
    
    // Respondo al cliente con un mensaje de exito, y a la vez estoy enviando la cookie con el token
    return res.status(200).json({message:"Login exitoso."});

  } catch (error) {

    return res.status(500).json({error:`Internal Server Error`})
  }
}


// Current
// Esta función se encarga de devolver la información del usuario actualmente autenticado
// obteniendo los datos del usuario desde el token
export const current = (req, res) => {
  res.json({ status: 'success', message: 'Usuario autenticado', user: req.user });
}


// Logout
// Esta función se encarga de cerrar la sesión del usuario 
// Eliminando la cookie que contiene el token
export const logout = (req, res) => {

  // Eliminamos la cookie que contiene el token
  res.clearCookie('mi_cookie');
  
  // Respondo al cliente con un mensaje de exito
  res.json({ status: 'success', message: 'Logout exitoso' });
}
