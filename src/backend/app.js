import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

const users = [
    {
        firstName: "John",
        lastName: "Doe",
        email: "John@example.com.au",
        password: "password123",
        isAdmin: true
    }]

const hireOptions = [
    {
        option: "1 hour",
        length: 60
    },
    {
        option: "2 hours",
        length: 120
    }]


dotenv.config()

try {
    const m = await mongoose.connect(process.env.DB_URI)
    console.log(m.connection.readyState == 1 ? 'Mongoose Connected' : 'Mongoose failed to connect')
}
catch (err) {
    console.error(err)
}

const User  = new mongoose.model('User', {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false}
})

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send({ info: 'GC Activity Rentals' }))

app.get('/users', (req, res) => res.send(users))

// Create a new User
app.post('/users', async (req, res) => {
    const newUser = await User.create(req.body)
    res.status(201).send(newUser)
})

app.get('/hireOptions', (req, res) => res.send(hireOptions)) 
// Routers

export default app