import { Router } from 'express'
import { HireOption } from '../db.js'

const router = Router()

// Get all Hire Options
router.get('/hireOptions', async (req, res) => res.send(await HireOption.find())) 


export default router