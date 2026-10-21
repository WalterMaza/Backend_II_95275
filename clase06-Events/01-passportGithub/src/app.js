import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import { initPassport } from './config/passport.config.js';

import { router as routerVistas} from './routes/views.router.js';
import { config } from './config/config.js';


const PORT=config.PORT;

const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(passport.initialize())
initPassport()

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('./public'));


app.use('/', routerVistas)

app.get("/logingithub", passport.authenticate("github", {session:false}))
app.get(
    "/api/sessions/callbackGithub", 
    passport.authenticate("github", {session:false}),
    (req, res)=>{

        // generar un jwt
        // devolverlo en una cookie con httpOnly en true

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({datosUser:req.user});
    }
)

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const conectar=async()=>{
    try {
        await mongoose.connect(config.MONGO_URL, {dbName:config.DB_NAME})
        console.log(`Conexión a DB establecida`)
    } catch (err) {
        console.log(`Error al conectarse con el servidor de BD: ${err}`)
    }
}

conectar();
