import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

try {
    const m = await mongoose.connect(process.env.DB_URI)
    console.log(m.connection.readyState == 1 ? 'Mongoose Connected' : 'Mongoose failed to connect')
}
catch (err) {
    console.error(err)
}

// User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false}
})

// User Model
const User  = new mongoose.model('User', userSchema)


// Hire Option Schema
const hireOptionSchema = new mongoose.Schema({
    option: { type: String, required: true },
    length: { type: Number, required: true }
})


// Hire Option Model
const HireOption  = new mongoose.model('HireOption', hireOptionSchema)


// Equipment Schema
const equipmentSchema = new mongoose.Schema({
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    rates: [
        {
            hireOption: {type: mongoose.Schema.Types.ObjectId, ref: HireOption, required: true},
            price: { type: Number, required: true }
        }
    ],
    image: { type: String, required: true}
})


// Equipment Model
const Equipment  = new mongoose.model('Equipment', equipmentSchema)


// Booking Schema
const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    equipment: { type: mongoose.Schema.Types.ObjectId, ref: Equipment, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    hireOption: { type: mongoose.Schema.Types.ObjectId, ref: HireOption, required: true},
    quantity: { type: Number, required: true }
})


// Booking Model
const Booking  = new mongoose.model('Booking', bookingSchema)

export { User, HireOption, Equipment, Booking } 
