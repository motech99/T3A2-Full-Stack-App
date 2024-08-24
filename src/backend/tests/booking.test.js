import request from "supertest"
import app from "../app.js"
import mongoose from "mongoose";
import { User, Equipment, HireOption, Booking } from '../db.js'


describe("POST /bookings", () => {
    let userToken;
    let equipmentId;
    let hireOptionId;
    let userId;
    let postBookingId;

    beforeAll(async () => {
        // Login as admin to get token
        const userLogin = await request(app)
            .post('/login')
            .send({ email: "jane@example.com", password: "secret123" });
        userToken = userLogin.body.token;

        // Retrieve or create seed data
        const hireOption = await HireOption.findOne({option: "1 hour"});
        hireOptionId = hireOption._id;
        
        const equipment = await Equipment.findOne({item: "Bike"});
        equipmentId = equipment._id;
        
        const user = await User.findOne({ email: "jane@example.com" });
        userId = user._id;

        // Create a booking
        const bookingResponse = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                equipment: equipmentId,
                quantity: 5,
                startTime: new Date(),
                hireOption: hireOptionId
            });

        postBookingId = bookingResponse.body._id
    });
    afterAll(async () => {
        // Cleanup: Delete created booking
        await Booking.findByIdAndDelete(postBookingId);
    });

    test("should create a new booking", async () => {
        const res = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                equipment: equipmentId,
                quantity: 2,
                startTime: new Date(new Date().getTime() + 3600000), // 1 hour from now
                hireOption: hireOptionId
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('equipment', equipmentId.toString());
        expect(res.body).toHaveProperty('quantity', 2);
    });

    test("should return 400 if required fields are missing", async () => {
        const res = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                equipment: equipmentId,
                quantity: 2
                // Missing startTime and hireOption
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Equipment ID, quantity, start time, and hire option ID are required.');
    });

    test("should return 400 if quantity exceeds available quantity", async () => {
        const res = await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                equipment: equipmentId,
                quantity: 100, // Assuming 100 exceeds available quantity
                startTime: new Date(new Date().getTime() + 3600000), // 1 hour from now
                hireOption: hireOptionId
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Requested quantity exceeds available quantity.');
    });

});
describe('PUT /bookings/:id', () => {
    let adminToken;
    let userToken;
    let putBookingId;
    let equipmentId;
    let hireOptionId;
    let anotherUser

    beforeAll(async () => {
        // Login as admin and user to get tokens
        const adminLogin = await request(app).post('/login').send({ email: 'john@example.com', password: 'password123' });
        adminToken = adminLogin.body.token;

        const userLogin = await request(app).post('/login').send({ email: 'jane@example.com', password: 'secret123' });
        userToken = userLogin.body.token;

        // Retrieve existing hire options and equipment
        const hireOptions = await request(app).get('/hireOptions').set('Authorization', `Bearer ${adminToken}`);
        hireOptionId = hireOptions.body[0]._id;

        const equipment = await request(app).get('/equipment').set('Authorization', `Bearer ${adminToken}`);
        equipmentId = equipment.body[0]._id;

        // Create a booking to be updated
        const booking = await request(app).post('/bookings').send({
            equipment: equipmentId,
            quantity: 5,
            startTime: new Date().toISOString(),
            hireOption: hireOptionId
        }).set('Authorization', `Bearer ${userToken}`);

        putBookingId = booking.body._id;
    });
    afterAll(async () => {
        // Cleanup: Delete the created booking
        await request(app).delete(`/bookings/${putBookingId}`).set('Authorization', `Bearer ${userToken}`)
        // Delete the created user
        await request(app).delete(`/users/${anotherUser._id}`)
    });

    test('Successfully updates a booking by admin', async () => {
        const updateData = { quantity: 10 };

        const res = await request(app)
            .put(`/bookings/${putBookingId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updateData);

        expect(res.status).toBe(200);
        expect(res.body.quantity).toBe(updateData.quantity);
    });

    test('Successfully updates a booking by the user who created it', async () => {
        const updateData = { quantity: 7 };

        const res = await request(app)
            .put(`/bookings/${putBookingId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(updateData);

        expect(res.status).toBe(200);
        expect(res.body.quantity).toBe(updateData.quantity);
    });

    test('Fails to update booking if user is not the owner and not an admin', async () => {
        // Create another user to test this scenario
        anotherUser = await request(app).post('/users')
        .send({ firstName: "Another", lastName: "User", email: "anotheruser@example.com", password: "anotherpassword" });
        // Get token
        const anotherUserLogin = await request(app).post('/login').send({
            email: 'anotheruser@example.com',
            password: 'anotherpassword'
        });
        const anotherUserToken = anotherUserLogin.body.token;

        const updateData = { quantity: 15 };

        const res = await request(app)
            .put(`/bookings/${putBookingId}`)
            .set('Authorization', `Bearer ${anotherUserToken}`)
            .send(updateData);

        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Access denied. You do not have permission to update this booking.');
    });

});

describe('GET /bookings', () => {
    let adminToken;
    let userToken;
    let userLogin;

    beforeAll(async () => {
        // Login as admin and user to get tokens
        const adminLogin = await request(app).post('/login').send({ email: 'john@example.com', password: 'password123' });
        adminToken = adminLogin.body.token;

        userLogin = await request(app).post('/login').send({ email: 'jane@example.com', password: 'secret123' });
        userToken = userLogin.body.token;

    })
    test('Returns all bookings for admin', async () => {
        const res = await request(app)
           .get('/bookings')
           .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    })
    test('Returns all bookings for the user who created them', async () => {
        const res = await request(app)
           .get('/bookings')
           .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body[0].user.firstName).toBe(userLogin.body.firstName);
    })
})

