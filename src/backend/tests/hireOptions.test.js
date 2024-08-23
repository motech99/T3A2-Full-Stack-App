import request from "supertest"
import app from "../app.js"


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

    test("should return an array of all hire options", () => {
        expect(hireOptionsArray).toBeInstanceOf(Array);
        expect(hireOptionsArray.length).toBe(4)
        hireOptionsArray.forEach(option => {
            expect(option).toHaveProperty('_id')
            expect(option).toHaveProperty('length')
            expect(option).toHaveProperty('option')
        });
    });

    test("should return status 200", () => {
        expect(res.status).toBe(200);
    });
});
