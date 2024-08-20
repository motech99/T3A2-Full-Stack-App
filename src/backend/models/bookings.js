import mongoose from "mongoose"
import { User } from "users.js"
import { Equipment } from "equipment.js"
import { HireOptions } from "hireOptions.js"


const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: User },
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: Equipment },
    date: { type: Date, required: true },
    time: { type: Date, required: true },
    hireOptions: { type: mongoose.Schema.Types.ObjectId, ref: HireOptions },
    quantity: { type: Number, required: true }
})

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking