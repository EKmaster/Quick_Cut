import request from "supertest"
import { createApp } from "../utils/createApp.mjs"
import mongoose from "mongoose"
import { response } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { Booking } from "../mongoose/schemas/booking.mjs";


describe("user signup, logout and then login", () => {
    let app;
    let jwt;
    beforeAll(() => {
        mongoose
            .connect("mongodb+srv://omerkhan5002:3Nz0bihPwrbkcgps@cluster0.sd9uxwv.mongodb.net/test")
            .then(() => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
        app = createApp();

    })

    it("should signup a user, logout, then log back in", async () => {
        // getting csrf token
        let response = await request(app)
            .get("/api/csrf-token")
            .set('Accept', 'application/json')
            .withCredentials(); // Ensure cookies are included in the request
        let csrfToken = response.body.csrfToken
        let csrfTokenCookie = response.headers['set-cookie'];

        // signing up user
        let reqBody = {
            email: "nodemon@gmail.com",
            password: "555",
            firstName: "Steve",
            lastName: "Wood"
        }
        response = await request(app).post("/api/auth/signup")
            .set('X-CSRF-Token', csrfToken).set('Cookie', csrfTokenCookie)
            .set('Content-Type', 'application/json').send(reqBody)
        jwt = response.headers['set-cookie'];

        // verifying that user is logged in
        response = await request(app).get("/api/auth/status").set("Cookie", jwt)
        expect(response.statusCode).toBe(200)

        // logging out 
        response = await request(app).post("/api/auth/logout")
            .set("Cookie", `${jwt}; ${csrfTokenCookie}`)
            .set("X-CSRF-Token", csrfToken)
        jwt = response.headers['set-cookie']
        response = await request(app).get("/api/auth/status").set("Cookie", jwt)
        expect(response.statusCode).toBe(401)

        // logging back in
        reqBody = { email: "nodemon@gmail.com", password: "555" }
        response = await request(app).post("/api/auth/login")
            .set('X-CSRF-Token', csrfToken).set("Cookie", csrfTokenCookie)
            .set('Content-Type', 'application/json')
            .send(reqBody)
        jwt = response.headers['set-cookie']
        expect(response.statusCode).toBe(200)
        expect(jwt).toBeDefined()
        response = await request(app).get("/api/auth/status").set("Cookie", jwt)
        expect(response.statusCode).toBe(200)

    }, 10 * 1000)

    afterAll(async () => {
        // Disconnect from the database
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("Disconnected from Test Database");
    });
})