import request from "supertest"
import app from "../app.js"


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

    // describe("PUT /equipment/:id", () => {
    //     let equipmentId
    //     let updatedItem
    //     let adminToken
    //     let userToken
    //     let res
    //     beforeAll(async () => {
    //         const equipment = await request(app).get('/equipment')
    //         equipmentId = equipment.body[0]._id
    //         updatedItem = "Updated Bike"
    //         const admin = 
    //         res = await request(app).put(`/equipment/${equipmentId}`)
    //            .send({ item: updatedItem })
    //            .set('Authorization', `Bearer ${adminToken}`)
    //     })

    //     test("PUT /equipment/:id successfully updates the equipment item ", async () => {
    //         expect(res.status).toBe(200)
    //         expect(res.body.item).toBe(updatedItem)
    //     })
    // })
    
})
