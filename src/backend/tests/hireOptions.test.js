import request from "supertest"
import app from "../app.js"


// describe('App Test', () => {
//     test("GET /", async () => {
//         const res = await request(app).get('/')
//         expect(res.status).toBe(200)
//         expect(res.headers['content-type']).toContain('json')
//         expect(res.body).toBeDefined()
//         expect(res.body.info).toBe('GC Activity Rentals')
//     })
// })


describe("GET /hireOptions", () => {
    let adminToken;
    let hireOptionsArray;
    let res

    beforeAll(async () => {
        // Log in as admin to get token
        const adminLogin = await request(app)
            .post('/login')
            .send({ email: "john@example.com", password: "password123" });
        adminToken = adminLogin.body.token;

        // Get all hire options
        res = await request(app)
            .get('/hireOptions')
            .set('Authorization', `Bearer ${adminToken}`);
        hireOptionsArray = res.body;
    });

    test("should return all hire options", () => {
        expect(hireOptionsArray).toBeInstanceOf(Array);
        expect(hireOptionsArray.length).toBeGreaterThan(0); // Assumes there is at least one hire option in the database
        hireOptionsArray.forEach(option => {
            expect(option).toHaveProperty('_id');
            expect(option).toHaveProperty('length'); // Replace with actual properties of HireOption
            expect(option).toHaveProperty('option'); // Replace with actual properties of HireOption
        });
    });

    test("should return status 200", () => {
        expect(res.status).toBe(200);
    });
});
