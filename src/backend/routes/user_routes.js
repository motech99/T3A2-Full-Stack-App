import { Router } from 'express'
import { User } from '../db.js'
import bcrypt from 'bcrypt'

const router = Router()

// Get Users
router.get('/users', async (req, res) => res.send(await User.find()))

// Create a new User

router.post('/users', async (req, res) => {
    try {
        const { password, ...userData } = req.body; 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ ...userData, password: hashedPassword });
        res.status(201).send(newUser);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


export default router