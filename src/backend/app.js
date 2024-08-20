import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { User } from './db.js'


const hireOptions = [
    {
        option: "1 hour",
        length: 60
    },
    {
        option: "2 hours",
        length: 120
    }]


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

app.get('/hireOptions', (req, res) => res.send(hireOptions)) 
// Routers

export default app