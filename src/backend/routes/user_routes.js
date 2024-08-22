import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { User } from '../db.js'
import { verifyAdmin, verifyUser } from "../auth.js"

const router = Router()

// Get Users
router.get('/users', verifyUser, verifyAdmin, async (req, res) => res.send(await User.find()))

// Create a new User

router.post('/users', async (req, res) => {
    try {
        const { email, password, ...userData } = req.body; 
        // Check email is in correct format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ error: 'Invalid email format.' });
        }
        // Hash Password for storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ ...userData, email: email.toLowerCase(), password: hashedPassword });
        res.status(201).send(newUser);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
})

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Convert email to lowercase to avoide case sensitivity
        const emailLower = email.toLowerCase();
        // Check if user exists and password is correct
        const user = await User.findOne({ email: emailLower });
        if (!user) {
            return res.status(404).send({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        )
        res.send({ token, firstName: user.firstName, isAdmin: user.isAdmin});
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})



export default router