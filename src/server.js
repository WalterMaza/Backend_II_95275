import app from './app.js'
import 'dotenv/config';

app.listen(process.env.PORT, () => {
  console.log('Servidor escuchando en el puerto 8080')
})