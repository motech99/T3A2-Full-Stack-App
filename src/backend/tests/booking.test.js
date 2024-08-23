import request from "supertest"
import app from "../app.js"
import { User, Equipment, HireOption, Booking } from '../db.js'


describe('App Test', () => {
    test("GET /", async () => {
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toBeDefined()
        expect(res.body.info).toBe('GC Activity Rentals')
    })
})

describe("POST /bookings", () => {
    let userToken;
    let equipmentId;
    let hireOptionId;
    let userId;

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
        await request(app)
            .post('/bookings')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                equipment: equipmentId,
                quantity: 5,
                startTime: new Date(),
                hireOption: hireOptionId
            });
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

    afterAll(async () => {
        // Cleanup: Delete created bookings
        await Booking.deleteMany({ user: userId });
    });
});
