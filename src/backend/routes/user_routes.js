import { Router } from 'express'
import { User } from '../db.js'

const router = Router()

// Get Users
router.get('/users', async (req, res) => res.send(await User.find()))

// Create a new User
router.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).send(newUser)
    } catch (err) {
        res.status(400).send({error: err.message})
    }
})

export default router