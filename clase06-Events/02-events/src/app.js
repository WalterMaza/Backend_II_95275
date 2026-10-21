import express from 'express';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as categoryRouter } from './routes/categoryRouter.js';
import { router as eventsRouter } from './routes/events.router.js';

import cookieParser from "cookie-parser"
import passport from 'passport';
import { initPassport } from './config/passport.config.js';

import { errorHandler } from './middleware/errorHandler.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// paso 2
app.use(passport.initialize())
// app.use(passport.session())   // solo si usan express-sessions
initPassport()

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use("/api/sessions", sessionsRouter)
app.use("/api/categories", categoryRouter)

//ROLES
app.use("/api/events", eventsRouter)


app.use(errorHandler)

await connectDB();
app.listen(config.port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.port}`);
});
