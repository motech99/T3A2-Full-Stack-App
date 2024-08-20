import mongoose from "mongoose";


const hireOptionSchema = new mongoose.Schema({
    option: { type: String, required: true }, // e.g. 1 hour, 2 hours, 1/2 day and full day
    length: { type: Number, required: true }, // Length of hire in hours or minutes
})

const HireOption = mongoose.model('HireOption', hireOptionSchema);


export default HireOption