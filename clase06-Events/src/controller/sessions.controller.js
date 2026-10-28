import { config } from "../config/env.js"
import jwt from "jsonwebtoken"

export const registro=async(req,res)=>{

    // req.user que deja passport.authenticate si sale OK
    res.status(200).json({message:"Registro exitoso", newUser: req.user})
}


export const login=async(req,res)=>{

    let token=jwt.sign(req.user, config.secret, {expiresIn: "1h"})

    res.cookie("cookietoken", token, {httpOnly: true})

    res.status(200).json({message:"Login exitoso", user: req.user})
}

export const current=(req, res)=>{
    
    res.status(200).json({message:"Current", user: req.user})
}

export const logout=(req, res)=>{

    res.clearCookie("cookietoken")
    
    return res.status(200).json({payload: "Logout exitoso!"});
}