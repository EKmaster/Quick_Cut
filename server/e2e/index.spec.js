import request from "supertest"
import { createApp } from "../utils/createApp.mjs"
import mongoose from "mongoose"
import { response } from "express";


describe("user sign up", () => {
    let app;
    beforeAll(() => {
        mongoose
        .connect("mongodb+srv://omerkhan5002:3Nz0bihPwrbkcgps@cluster0.sd9uxwv.mongodb.net/test")
        .then(() => console.log("Connected to Test Database"))
        .catch((err) => console.log(`Error: ${err}`));
        app = createApp();
        
    })
    it("successfully sign's a user up, adding them to the database, and sending a JWT back", async () => {
        // getting csrf token
        let response = await request(app)
            .get("/api/csrf-token")
            .set('Accept', 'application/json')
            .withCredentials(); // Ensure cookies are included in the request

        expect(response.statusCode).toBe(200)
        const csrfToken = response.body.csrfToken
        const cookie = response.headers['set-cookie'];

        expect(csrfToken).toBeDefined()
        
        const reqBody = {
            email: "d3m213in3i@d32.com",
            password: "n12ein1",
            firstName: "Joe",
            lastName: "Steven"
        }
        response = await request(app).post("/api/auth/signup")
            .set('X-CSRF-Token', csrfToken).set('Cookie', cookie)
            .set('Content-Type', 'application/json').send(reqBody)
            .withCredentials() // Ensure cookies are included in the request
        expect(response.statusCode).toBe(200)
    })
    it("should return 401 when not logged in", async () => {
        const res = await request(app).get("/api/auth/status")
        expect(res.statusCode).toBe(401)
    })
    afterAll(async () => {
        // Disconnect from the database
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("Disconnected from Test Database");
    });
})