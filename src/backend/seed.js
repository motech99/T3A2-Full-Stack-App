import mongoose from 'mongoose'
import {User, HireOption, Equipment, Booking} from "./db.js"


const users = [
    {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        isAdmin: true
    },
    {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: "secret123",
        isAdmin: false
    }
]


await User.deleteMany()
console.log('Deleted Users')
const userList = await User.insertMany(users)
console.log('Added users')

const hireOptions = [
    {
        option: "1 hour",
        length: 60
    },
    {
        option: "2 hours",
        length: 120
    },
    {
        option: "1/2 day",
        length: 240
    },
    {
        option: "Full day",
        length: 480
    }
]

await HireOption.deleteMany()
console.log('Deleted Hire Options')
const options = await HireOption.insertMany(hireOptions)
console.log('Added Hire Options')


const equipment = [
    {
        item: "Bike",
        quantity: 15,
        rates: [
            {
                hireOption: options[0],
                price: 25
            },
            {
                hireOption: options[1],
                price: 40
            },
            {
                hireOption: options[2],
                price: 60
            },
            {
                hireOption: options[3],
                price: 80
            }
        ],
        image: "bike.jpg"
    },
    {
        item: "Stand Up Paddle Board",
        quantity: 5,
        rates: [
            {
                hireOption: options[0],
                price: 15
            },
            {
                hireOption: options[1],
                price: 25
            },
            {
                hireOption: options[2],
                price: 40
            },
            {
                hireOption: options[3],
                price: 60
            }
        ],
        image: "sup.jpg"
    },
    {
        item: "Surfboard",
        quantity: 5,
        rates: [
            {
                hireOption: options[0],
                price: 20
            },
            {
                hireOption: options[1],
                price: 30
            },
            {
                hireOption: options[2],
                price: 50
            },
            {
                hireOption: options[3],
                price: 70
            }
        ],
        image: "surfboard.jpg"
    },
    {
        item: "Kayak",
        quantity: 5,
        rates: [
            {
                hireOption: options[0],
                price: 20
            },
            {
                hireOption: options[1],
                price: 30
            },
            {
                hireOption: options[2],
                price: 50
            },
            {
                hireOption: options[3],
                price: 80
            }
        ],
        image: "kayak.jpg"
    },
]

await Equipment.deleteMany()
console.log('Deleted Equipment')
const items = await Equipment.insertMany(equipment)
console.log('Added Equipment')

const bookings = [
    {
        user: userList[0],
        equipment: items[0],
        date: new Date(),
        time: new Date(),
        hireOption: options[0],
        quantity: 2
    },
    {
        user: userList[1],
        equipment: items[1],
        date: new Date(),
        time: new Date(),
        hireOption: options[1],
        quantity: 1
    }
]

await Booking.deleteMany()
console.log('Deleted Bookings')
await Booking.insertMany(bookings)
console.log('Added Bookings')


console.log('Seeding Completed!')

mongoose.disconnect()