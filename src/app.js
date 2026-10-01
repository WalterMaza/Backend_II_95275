import express from 'express';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import sessionsRouter from './routes/sessions.router.js';
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(cookieParser())


app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/sessions', sessionsRouter);

await connectDB();
app.listen(config.port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.port}`);
});
