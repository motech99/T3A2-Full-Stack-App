// // import Booking from "./models/bookings"
// import Equipment from "./models/equipment.js"
// import HireOption from "./models/hireOptions.js"
// import User from "./models/users.js"


// const users = [
//     {
//         firstName: "John",
//         lastName: "Doe",
//         email: "john@example.com",
//         password: "password123",
//         isAdmin: true
//     },
//     {
//         firstName: "Jane",
//         lastName: "Smith",
//         email: "jane@example.com",
//         password: "secret123",
//         isAdmin: false
//     }
// ]

// await User.deleteMany()
// console.log('Deleted Users')
// await User.insertMany(users)
// console.log('Added users')

// const hireOptions = [
//     {
//         option: "1 hour",
//         length: 60
//     },
//     {
//         option: "2 hours",
//         length: 120
//     },
//     {
//         option: "1/2 day",
//         length: 240
//     },
//     {
//         option: "Full day",
//         length: 480
//     }
// ]

// await HireOption.deleteMany()
// console.log('Deleted Hire Options')
// await HireOption.insertMany(hireOptions)
// console.log('Added hireOptions')

// const equipment = [
//     {
//         item: "Bike",
//         quantity: 15,
//         hireOption: [
//             {
//                 hireOption: option[0],
//                 price: 20
//             },
//             {
//                 hireOption: option[1],
//                 price: 30
//             },
//             {
//                 hireOption: option[2],
//                 price: 20
//             },
//             {
//                 hireOption: option[3],
//                 price: 20
//             }
//         ],
//         image: "bike.jpg"
//     },
//     {
//         item: "Stand Up Paddle Board",
//         quantity: 5,
//         hireOption: [
//             {
//                 hireOption: option[0],
//                 price: 20
//             },
//             {
//                 hireOption: option[1],
//                 price: 30
//             },
//             {
//                 hireOption: option[2],
//                 price: 20
//             },
//             {
//                 hireOption: option[3],
//                 price: 20
//             }
//         ],
//         image: "sup.jpg"
//     },
//     {
//         item: "Surfboard",
//         quantity: 5,
//         hireOption: [
//             {
//                 hireOption: option[0],
//                 price: 20
//             },
//             {
//                 hireOption: option[1],
//                 price: 30
//             },
//             {
//                 hireOption: option[2],
//                 price: 20
//             },
//             {
//                 hireOption: option[3],
//                 price: 20
//             }
//         ],
//         image: "surfboard.jpg"
//     },
//     {
//         item: "Kayak",
//         quantity: 5,
//         hireOption: [
//             {
//                 hireOption: option[0],
//                 price: 20
//             },
//             {
//                 hireOption: option[1],
//                 price: 30
//             },
//             {
//                 hireOption: option[2],
//                 price: 20
//             },
//             {
//                 hireOption: option[3],
//                 price: 20
//             }
//         ],
//         image: "kayak.jpg"
//     },
// ]

// await Equipment.deleteMany()
// console.log('Deleted Equipment')
// await Equipment.insertMany(equipment)
// console.log('Added Equipment')