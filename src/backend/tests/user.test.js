import request from "supertest"
import app from "../app.js"
import { User } from "../db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
        }
    })

    afterAll(async () => {
        // Cleanup test user
        await User.deleteMany({ email: testUser.email });
    })

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
    })

    test("should return 400 for invalid email format", async () => {
        const res = await request(app)
            .post('/users')
            .send({ ...testUser, email: "invalidemail" });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid email format.');
    })

    test("should return 400 for missing required fields", async () => {
        const res = await request(app)
            .post('/users')
            .send({ firstName: "Test" }); // Missing required fields

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    })
})
describe("POST /login", () => {
    let testUser;
    
    beforeAll(async () => {
        // Create a test user for login testing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        testUser = new User({
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            password: hashedPassword,
            isAdmin: true
        });
        await testUser.save();
    });

    afterAll(async () => {
        // Cleanup test user
        await User.deleteMany({ email: 'testuser@example.com' });
    });

    test("should log in successfully with valid credentials", async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'testuser@example.com', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('firstName', testUser.firstName);
        expect(res.body).toHaveProperty('isAdmin', testUser.isAdmin);
    })

    test("should return 404 if email does not exist", async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'nonexistent@example.com', password: 'password123' });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Invalid email or password');
    })

    test("should return 400 if password is incorrect", async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'testuser@example.com', password: 'wrongpassword' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid email or password');
    })

})