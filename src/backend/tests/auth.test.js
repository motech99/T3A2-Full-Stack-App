import request from "supertest"
import app from "../app.js"


describe('App Test', () => {
    test("GET /", async () => {
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toBeDefined()
        expect(res.body.info).toBe('GC Activity Rentals')
    })
})