import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {HireOption, Equipment, Booking} from './db.js'
import userRoutes from './routes/user_routes.js'


const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send({ info: 'GC Activity Rentals' }))

app.use(userRoutes)

// Get all Hire Options
app.get('/hireOptions', async (req, res) => res.send(await HireOption.find())) 

// Get all Equipment Options
app.get('/equipment', async (req, res) => res.send(await Equipment.find()))

// Get single equipment option
app.get('/equipment/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
        if (equipment) {
            res.send(equipment)
        } else {
            res.status(404).send({ error: 'Equipment not found' })
        }
    }
    catch (err) {
        res.status(400).send({ error: err.message })
    }
})

// Get all Bookings
app.get('/bookings', async (req, res) => res.send(await Booking.find()))

// Routers

export default app