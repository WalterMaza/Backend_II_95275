import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from "cookie-parser"
import { initPassport } from './config/passport.config.js';

import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as vistasRouter } from './routes/vistas.router.js';
import { errorHandler } from './middleware/errorHandler.js';

process.loadEnvFile("./.env")

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// paso 2
app.use(passport.initialize())
// app.use(passport.session())   // solo si usan express-sessions
initPassport()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use("/api/sessions", sessionsRouter)
app.use('/', vistasRouter)

app.get("/pruebas",
    passport.authenticate("current", {session: false}),
    (req, res) => {

        if (req.query.error) {
            throw new Error("Error de pruebas... :(")
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "pruebas" });
    }
)

app.get("/datos",
    passport.authenticate("current", {session: false}),
    (req, res) => {

        if (req.query.error) {
            throw new Error("Error de pruebas... :(")
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ payload: "datos del user "+req.user.firstName });
    }
)

app.use(errorHandler)

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const conectar = async () => {
    try {
        await mongoose.connect("mongodb+srv://coderhouse:codercoder2023@cluster0.wpxpupc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=comis95275clase04")
        console.log(`Conexión a DB establecida`)
    } catch (err) {
        console.log(`Error al conectarse con el servidor de BD: ${err}`)
    }
}

conectar();
