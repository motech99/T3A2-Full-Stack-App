import { Router } from "express";
import { Booking } from '../db.js'
import { HireOption } from "../db.js"
import { Equipment } from "../db.js";
import { verifyAdmin, verifyUser, verifyOwnerOrAdmin } from "../auth.js"

const router = Router();

// Get all Bookings
router.get('/bookings', verifyUser, verifyAdmin, async (req, res) => res.send(await Booking.find()
.populate({path:"user", select: "firstName lastName"})
.populate({path:"equipment", select: "item"})
.populate({path:"hireOption", select: "option"})));


// Get all bookings made by logged in user
// Get all bookings for the logged-in user
router.get('/bookings/manage', verifyUser, async (req, res) => {
    try {
        const currentUser = req.user.userId;
        const isAdmin = req.user.isAdmin;

        // Find all bookings for the current user, or all bookings if the user is an admin
        const bookings = await Booking.find(isAdmin ? {} : { user: currentUser })
            .populate({ path: "hireOption", select: "option" })
            .populate({ path: "equipment", select: "item rates.hireOption rates.price" });

        if (!bookings || bookings.length === 0) {
            return res.status(404).send({ error: 'No bookings found' });
        }

        // Calculate total prices for each booking
        const bookingsWithTotalPrice = bookings.map(booking => {
            let totalPrice = 0;
            if (booking.equipment && booking.hireOption) {
                const matchingRate = booking.equipment.rates.find(rate => 
                    rate.hireOption.toString() === booking.hireOption._id.toString()
                );

                if (matchingRate) {
                    totalPrice = matchingRate.price * booking.quantity;
                }

                // Return only the matching rate
                booking.equipment.rates = [matchingRate];
            }

            return {
                ...booking.toObject(),
                totalPrice
            };
        });

        return res.send(bookingsWithTotalPrice);

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});



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
        const { equipment, quantity, startTime, hireOption } = req.body;

        if (!equipment || !quantity || !startTime || !hireOption) {
            return res.status(400).send({ error: 'Equipment ID, quantity, start time, and hire option ID are required.' });
        }

        const start = new Date(startTime);

        // Fetch HireOption to get the hire length
        const hireLength = await HireOption.findById(hireOption);
        if (!hireLength) {
            return res.status(404).send({ error: 'Hire Option not found.' });
        }

        const end = new Date(start);
        end.setMinutes(end.getMinutes() + hireOption.length);  // Adjust based on hireOption length

        if (start >= end) {
            return res.status(400).send({ error: 'End time must be after start time.' });
        }

        // Retrieve equipment
        const equipmentSelected = await Equipment.findById(equipment);
        if (!equipmentSelected) {
            return res.status(404).send({ error: 'Equipment not found.' });
        }

        // Check current availability
        const conflictingBookings = await Booking.find({
            equipment: equipment,
            $or: [
                { $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }] }
            ]
        });

        const bookedQuantity = conflictingBookings.reduce((total, booking) => total + booking.quantity, 0);
        const availableQuantity = equipmentSelected.quantity - bookedQuantity;

        if (quantity > availableQuantity) {
            return res.status(400).send({ error: 'Requested quantity exceeds available quantity.' });
        }

        // Create the booking
        const newBooking = new Booking({
            user: req.user.userId,
            equipment: equipment,
            startTime: start,
            endTime: end,
            quantity,
            hireOption: hireOption
        });

        await newBooking.save();
        res.status(201).send(newBooking);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

export default router