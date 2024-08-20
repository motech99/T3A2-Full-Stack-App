import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { User, HireOption} from './db.js'


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
// Routers

export default app