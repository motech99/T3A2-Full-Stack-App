import { Router } from "express";
import { Booking } from '../db.js'
import { verifyAdmin, verifyUser, verifyOwnerOrAdmin } from "../auth.js"

const router = Router();

// Get all Bookings
router.get('/bookings', verifyUser, verifyAdmin, async (req, res) => res.send(await Booking.find()
.populate({path:"user", select: "firstName lastName"})
.populate({path:"equipment", select: "item"})
.populate({path:"hireOption", select: "option"})));


// Get single booking
router.get('/bookings/:id', verifyUser, async (req, res) => {
    try {
        const currentUser = req.user.userId
        const isAdmin = req.user.isAdmin
        const booking = await Booking.findById(req.params.id)
       .populate({path:"equipment", select: "item rates"})
       .populate({path:"hireOption", select: "option"});

       if (!booking) {
        return res.status(404).send({ error: 'Booking not found' });
        }
        if (booking.user.toString() === currentUser || isAdmin) {
        return res.send(booking);
        }  else {
        return res.status(403).send({ error: 'Access denied. You do not have permission to view this booking.' });
        }
      
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})


// Update Booking
router.put('/bookings/:id', verifyUser, async (req, res) => {
    try {
        const currentUser = req.user.userId
        const isAdmin = req.user.isAdmin
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!booking) {
            res.status(404).send({ error: 'Booking not found' })
        } 
        if (booking.user.toString() === currentUser || isAdmin) {
            res.send(booking)
        } else {
            res.status(403).send({ error: 'Access denied. You do not have permission to update this booking.' })
        }
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})


// Delete Booking
router.delete('/bookings/:id', verifyUser, async (req, res) => {
    try {
        const currentUser = req.user.userId
        const isAdmin = req.user.isAdmin
        const booking = await Booking.findById(req.params.id)
        if (!booking) {
            res.status(404).send({ error: 'Booking not found' })
            
        } if (booking.user.toString() === currentUser || isAdmin) {
            await Booking.findByIdAndDelete(req.params.id)
            res.sendStatus(200)
        }else { res.status(403).send({ error: 'Access denied. You do not have permission to delete this booking.' })
        }
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

// Create a new Booking
router.post('/bookings', verifyUser, async (req, res) => {
    try {
        const newBooking = await Booking.create(req.body)
        res.status(201).send(newBooking)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

export default router