import { Router } from "express";
import { Booking } from '../db.js'

const router = Router();

// Get all Bookings
// TODO: Make admin only
router.get('/bookings', async (req, res) => res.send(await Booking.find()
.populate({path:"user", select: "firstName lastName"})
.populate({path:"equipment", select: "item"})
.populate({path:"hireOption", select: "option"})));


// Get single booking
// TODO: Make owner or admin only
router.get('/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
       .populate({path:"equipment", select: "item rates"})
       .populate({path:"hireOption", select: "option"});
        if (booking) {
            res.send(booking)
        } else {
            res.status(404).send({ error: 'Booking not found' })
        }
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})


// Update Booking
// TODO: Make owner or admin only
router.put('/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (booking) {
            res.send(booking)
        } else {
            res.status(404).send({ error: 'Booking not found' })
        }
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})


// Delete Booking
// TODO: Make owner or admin only
router.delete('/bookings/:id', async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id)
        if (deletedBooking) {
            res.sendStatus(200)
        } else {
            res.status(404).send({ error: 'Booking not found' })
        }
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

// Create a new Booking
router.post('/bookings', async (req, res) => {
    try {
        const newBooking = await Booking.create(req.body)
        res.status(201).send(newBooking)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

export default router