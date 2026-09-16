import express from 'express'

import { connectDB } from './config/database.js'
// import usersRouter from './src/routes/users.routes.js'
// import sessionsRouter from './src/routes/sessions.routes.js'
// import ticketsRouter from './src/routes/tickets.routes.js'
import eventsRouter from './routes/events.routes.js'

const app = express()

app.use(express.json())

connectDB()

// app.use('/api/users', usersRouter)
// app.use('/api/sessions', sessionsRouter)
// app.use('/api/tickets', ticketsRouter)
app.use('/api/events', eventsRouter)

export default app



