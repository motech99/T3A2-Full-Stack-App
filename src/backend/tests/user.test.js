import request from "supertest"
import app from "../app.js"
import { User } from "../db.js"


describe("POST /users", () => {
    let testUser;

    beforeAll(async () => {
        // Setup test user data
        testUser = {
            firstName: "Test",
            lastName: "User",
            email: "testuser@example.com",
            password: "password123",
            isAdmin: false
        };
    });

    afterAll(async () => {
        // Cleanup test user
        await User.deleteMany({ email: testUser.email });
    });

    test("should create a new user with valid data", async () => {
        const res = await request(app)
            .post('/users')
            .send(testUser);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('firstName', testUser.firstName);
        expect(res.body).toHaveProperty('lastName', testUser.lastName);
        expect(res.body).toHaveProperty('email', testUser.email.toLowerCase());
        const userInDb = await User.findOne({ email: testUser.email });
        expect(userInDb).not.toBeNull();
        expect(userInDb.password).not.toBe(testUser.password); // Ensure password is hashed
    });

    test("should return 400 for invalid email format", async () => {
        const res = await request(app)
            .post('/users')
            .send({ ...testUser, email: "invalidemail" });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid email format.');
    });

    test("should return 400 for missing required fields", async () => {
        const res = await request(app)
            .post('/users')
            .send({ firstName: "Test" }); // Missing required fields

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});
