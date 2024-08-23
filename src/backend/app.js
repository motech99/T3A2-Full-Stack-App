import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoutes from './routes/user_routes.js'
import hireOptionsRoutes from './routes/hire_options_routes.js'
import equipmentRoutes from './routes/equipment_routes.js'
import bookingRoutes from './routes/booking_routes.js'


const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send({ info: 'GC Activity Rentals!' }))


// Routers
app.use(userRoutes)
app.use(hireOptionsRoutes)
app.use(equipmentRoutes)
app.use(bookingRoutes)

export default app