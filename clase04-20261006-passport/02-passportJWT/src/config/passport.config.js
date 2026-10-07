import passport from "passport"
import local from "passport-local"
import passportJWT from "passport-jwt"
import { UsersDAO } from "../dao/UsersDAO.js"
import { generaHash, generateError, validaPass } from "../utils.js"

const buscarToken=req=>{
    let token=null

    if(req.cookies.cookietoken){
        token=req.cookies.cookietoken
    }

    return token
}

export const initPassport=()=>{

    const usersDAO=new UsersDAO()

    // 1°
    passport.use("register", new local.Strategy(
        {
            usernameField: "email", 
            // passwordField: "clave",
            passReqToCallback: true, 
        }, 
        async(req, username, password, done)=>{   // cb
            try {
                let {firstName, lastName}=req.body
                if(!firstName || !lastName){
                    console.log("faltan datos")
                    // res.setHeader('Content-Type','application/json');
                    // return res.status(400).json({error:`error: faltan datos...`})
                    // return done(null, false)
                    // return done(new Error("error: faltan datos requeridos"))
                    return done(generateError(`Error: faltan datos requeridos`, "modulo de configuración de passport", 400))
                }
                
                let existe=await usersDAO.getBy({email: username})
                if(existe){
                    console.log("usuario ya existe")
                    // return done(null, false, {message: "usuario ya existe en DB"})
                    // return done(new Error(`Error: el email ${username} ya existe en DB`))
                    // let error=new Error(`Error: el email ${username} ya existe en DB`)

                    // error.statusCode=409
                    // error.origen="modulo de configuración de passport"

                    // return done(error)
                    return done(generateError(`Error: el email ${username} ya existe en DB`, "modulo de configuración de passport", 409))
                }
                
                // resto validaciones pertinentes... 
                password=await generaHash(password)

                let newUser=await usersDAO.create({
                    firstName, lastName, email: username, 
                    password
                })

                let {password: pass1, __v, _id, createdAt, updatedAt, ...safeUser} = newUser

                return done(null, safeUser)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use("login", new local.Strategy(
        {
            usernameField: "email", 
        }, 
        async(username, password, done)=>{
            try {
                let user=await usersDAO.getBy({email: username})
                if(!user){
                    return done(generateError(`Credenciales inválidas`, undefined, 400))
                }
                
                if(!validaPass(password, user.password)){
                    return done(generateError(`Credenciales inválidas`, undefined, 400))
                }   

                let {password: pass1, __v, _id, createdAt, updatedAt, ...safeUser} = user

                return done(null, safeUser)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use("current", new passportJWT.Strategy(
        {
            secretOrKey: process.env.SECRET, 
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken])
        }, 
        async(payload, done)=>{  //payload o user
            try {
                return done(null, payload)
            } catch (error) {
                return done(error)
            }
        }
    ))

    // 1' 
    // configuracion de serialize / deserialize
    // solo se configura si usan express-sessions
    // passport.serializeUser()
    // passport.deserializeUser()

}