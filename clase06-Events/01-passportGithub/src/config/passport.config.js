import passport from "passport"
import passportGithub from "passport-github2"
import { usuariosModelo } from "../models/usuario.model.js"

// http://localhost:3000/api/sessions/callbackGithub
// Client ID: Iv23li8nAUhYqfJlDaZ2
// secret: 5480f7a84bd9dd33de9cd50877b1dd098f9cc175

export const initPassport=()=>{
    // paso 1

    passport.use("github", new passportGithub.Strategy(
        {
            callbackURL: "http://localhost:3000/api/sessions/callbackGithub",
            clientSecret: "5480f7a84bd9dd33de9cd50877b1dd098f9cc175",
            clientID: "Iv23li8nAUhYqfJlDaZ2",
        },
        async(t1, t2, profile, done)=>{
            try {
                // console.log(profile)
                let {email, name}=profile._json
                if(!email){
                    return done(null, false)
                    // return done(new Error("La cuenta de Github no tiene email configurado"))
                }

                let user=await usuariosModelo.findOne({email})
                if(!user){
                    user=await usuariosModelo.create({email, nombre: name, profile})
                }

                // return done(null, {id: 1, name: "Mariana"})
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))


    // paso 1 '  
    // passport.serializeUser()
    // passport.deserializeUser()
}

