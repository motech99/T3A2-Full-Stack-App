import mongoose from 'mongoose'
import {User, HireOption, Equipment} from "./db.js"


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
await User.insertMany(users)
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
        hireOption: [
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
        hireOption: [
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
        hireOption: [
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
        hireOption: [
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
await Equipment.insertMany(equipment)
console.log('Added Equipment')

mongoose.disconnect()