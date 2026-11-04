import express from 'express';
import { connDB } from './config/db.js';
import { config } from './config/env.js';

import { router as productsRouter } from './routes/productsRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';
const PORT=3000;

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productsRouter)

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

app.use(errorHandler)

connDB(config.mongoUri)

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
