import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { User, HireOption, Equipment, Booking} from './db.js'


const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send({ info: 'GC Activity Rentals' }))

// Get Users
app.get('/users', async (req, res) => res.send(await User.find()))

// Create a new User
app.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).send(newUser)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

// Get all Hire Options
app.get('/hireOptions', async (req, res) => res.send(await HireOption.find())) 

// Get all Equipment Options
app.get('/equipment', async (req, res) => res.send(await Equipment.find()))

// Get single equipment option
app.get('/equipment/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id).populate("hireOption.hireOption")
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
app.get('/bookings', async (req, res) => res.send(await Booking.find().populate("user.firstName equipment")))

// Routers

export default app