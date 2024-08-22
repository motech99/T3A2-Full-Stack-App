import { Router } from 'express'
import { HireOption } from '../db.js'
import { verifyAdmin, verifyUser } from "../auth.js"

const router = Router()

// Get all Hire Options
router.get('/hireOptions', verifyUser, verifyAdmin, async (req, res) => res.send(await HireOption.find())) 


export default router