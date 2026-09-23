import { UserModel } from '../models/user.model.js';
import { createHash, validaPass } from '../utils/hash.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const register = async (req, res) => {
  try {
    // nunca aceptar el role...!!!
    let {first_name, last_name, email, password} = req.body

    // validaciones pertinentes
    if(!first_name || !last_name || !email || !password){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Faltan datos requeridos`})
    }    

    let emailNormalized=email.trim().toLowerCase()

    if(!EMAIL_REGEX.test(emailNormalized)){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Email con formato invalido`})
    }

    if(password.trim().length<MIN_PASSWORD_LENGTH){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`La contraseña debe tener un tamaño mínimo de ${MIN_PASSWORD_LENGTH} caracteres`})
    }

    let existe=await UserModel.findOne({email: emailNormalized})
    if(existe){
      res.setHeader('Content-Type','application/json');
      return res.status(409).json({error:`El email ${emailNormalized} ya existe en DB`})
    }

    let hashedPassword=await createHash(password)

    let user=await UserModel.create({first_name, last_name, email: emailNormalized, password: hashedPassword})

    // mas adelante será implementado con un DTO
    let {password:password1, __v, _id, createdAt, updatedAt, ...safeUser } = user.toJSON()
    // res.status(501).json({ status: 'error', error: 'Falta implementar el registro' });
    res.setHeader('Content-Type','application/json');
    return res.status(201).json({message:"Registro exitoso", user: safeUser});
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

export const login=async(req, res)=>{
  try {
    let {email, password}=req.body
    if(!email || !password){
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`email | password son requeridos`})
    }

    let user=await UserModel.findOne({email}).lean()  // toJSON() / deshidrata el documento
    if(!user){
      res.setHeader('Content-Type','application/json');
      return res.status(401).json({error:`Credenciales invalidas`})
    }

    if(!validaPass(password, user.password)){
      res.setHeader('Content-Type','application/json');
      return res.status(401).json({error:`Credenciales invalidas`})      
    }

    let {password:password1, __v, _id, createdAt, updatedAt, ...safeUser } = user

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({message:"Login exitoso para "+safeUser.first_name, user: safeUser});

  } catch (error) {
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({error:`Internal Server Error`})
  }
}
