import { Router } from "express"
import { Equipment } from '../db.js'
import { verifyAdmin, verifyUser } from "../auth.js"

const router = Router()

// Get all Equipment Options
router.get('/equipment', async (req, res) => res.send(await Equipment.find().populate("rates.hireOption")))

// Get single equipment option
router.get('/equipment/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id).populate("rates.hireOption")
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

// Update Equipment
router.put('/equipment/:id', verifyUser, verifyAdmin, async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (equipment) {
            res.send(equipment)
        } else {
            res.status(404).send({ error: 'Equipment not found' })
        }
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})


// Add New Equipment
router.post('/equipment', verifyUser, verifyAdmin, async (req, res) => {
    try {
        const newEquipment = await Equipment.create(req.body)
        res.status(201).send(newEquipment)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

export default router