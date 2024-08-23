import request from "supertest"
import app from "../app.js"
import { User, Equipment } from '../db.js'
import mongoose from "mongoose"


describe('Equipment Routes', () => {

    describe("GET/ equipment", () => {
        let res

        beforeAll(async () => {
            res = await request(app).get('/equipment')
        })

        test("GET /equipment successfully returns JSON content ", async () => {
            expect(res.status).toBe(200)
            expect(res.headers['content-type']).toContain('json')
        })

        test("GET /equipment returns an array of 4 equipment objects ", async () => {
            expect(res.body).toBeDefined()
            expect(res.body).toBeInstanceOf(Array)
            expect(res.body).toHaveLength(4)
        })

        test("GET /equipment returns the correct equipment fields ", async () => {
            const equipment = res.body[0]
            expect(equipment._id).toBeDefined()
            expect(equipment.item).toBeDefined()
            expect(equipment.quantity).toBeDefined()
            expect(equipment.rates).toBeDefined()
            expect(equipment.rates).toBeInstanceOf(Object)
            expect(equipment.image).toBeDefined()
        })

        test("GET /equipment includes the Bike object ", async () => {
            expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({item: "Bike"})]))
    
        })
    })

    describe("GET /equipment/:id", () => {
        let equipmentId
        let res
        beforeAll(async () => {
            const equipment = await request(app).get('/equipment')
            equipmentId = equipment.body[0]._id
            res = await request(app).get(`/equipment/${equipmentId}`)
        })

        test("GET /equipment/:id successfully returns JSON content ", async () => {
            expect(res.status).toBe(200)
            expect(res.headers['content-type']).toContain('json')
        })

        test("GET /equipment/:id returns a single equipment object ", async () => {
            expect(res.body).toBeDefined()
            expect(res.body._id).toBe(equipmentId)
        })

        test("GET /equipment/:id is the Bike object ", async () => {
            expect(res.body).toEqual(expect.objectContaining({item: "Bike"}))
        })
    })
    describe("PUT /equipment/:id", () => {
        let adminToken;
        let userToken;
        let equipmentId;
        let existingEquipment;
        let originalEquipmentData;
    
        beforeAll(async () => {
            // Log in as admin to get the token
            const adminLogin = await request(app)
                .post('/login')
                .send({ email: "john@example.com", password: "password123" });
            adminToken = adminLogin.body.token;
    
            // Log in as a regular user to get the token
            const userLogin = await request(app)
                .post('/login')
                .send({ email: "jane@example.com", password: "secret123" });
            userToken = userLogin.body.token;
    
            // Retrieve an existing equipment from seed data
            const equipment = await request(app)
                .get('/equipment')
            existingEquipment = equipment.body[0];
            equipmentId = existingEquipment._id;
    
            // Store the original data for later restoration
            originalEquipmentData = { item: existingEquipment.item, quantity: existingEquipment.quantity };
        });
    
        afterEach(async () => {
            // Restore the equipment to its original state
            await request(app)
                .put(`/equipment/${equipmentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(originalEquipmentData);
        });
    
        test("Admin successfully updates equipment", async () => {
            const updateData = { item: "Updated Item", quantity: 30 };
    
            const res = await request(app)
                .put(`/equipment/${equipmentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);
    
            expect(res.status).toBe(200);
            expect(res.body.item).toBe("Updated Item");
            expect(res.body.quantity).toBe(30);
        });
    
        test("Non-admin user cannot update equipment", async () => {
            const updateData = { item: "User Attempt Update", quantity: 50 };
    
            const res = await request(app)
                .put(`/equipment/${equipmentId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send(updateData);
    
            expect(res.status).toBe(403);
            expect(res.body.error).toBe("Access denied. You must be an admin.");
        });
    
        test("Admin cannot update non-existent equipment", async () => {
            const nonExistentId = new mongoose.Types.ObjectId();  // Generate a valid ObjectId that doesn't exist
            const updateData = { item: "Non-existent Update", quantity: 15 };
    
            const res = await request(app)
                .put(`/equipment/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);
    
            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Equipment not found");
        });
    
        test("Invalid update data results in 400 error", async () => {
            const updateData = { item: "", quantity: -10 }; // Invalid data
    
            const res = await request(app)
                .put(`/equipment/${equipmentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);
    
            expect(res.status).toBe(400);
            expect(res.body.error).toBeTruthy(); // Ensure an error message is present
        });
    });
    
})
