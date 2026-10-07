import jwt from "jsonwebtoken"

export const registro=async(req,res)=>{

    // req.user que deja passport.authenticate si sale OK

    res.setHeader('Content-Type','application/json')
    res.status(200).json({message:"Registro exitoso", newUser: req.user})
}


export const login=async(req,res)=>{

    let token=jwt.sign(req.user, process.env.SECRET, {expiresIn: "1h"})

    res.cookie("cookietoken", token, {httpOnly: true})

    res.setHeader('Content-Type','application/json')
    res.status(200).json({message:"Login exitoso", user: req.user})
}