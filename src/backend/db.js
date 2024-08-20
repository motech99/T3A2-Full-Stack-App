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

const User  = new mongoose.model('User', {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false}
})


export { User }