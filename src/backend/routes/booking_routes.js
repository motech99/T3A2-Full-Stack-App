import { Router } from "express";
import { Booking } from '../db.js'

const router = Router();

// Get all Bookings
router.get('/bookings', async (req, res) => res.send(await Booking.find()))



export default router