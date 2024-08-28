import request from "supertest"
import { createApp } from "../utils/createApp.mjs"
import mongoose from "mongoose"
import { response } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { Booking } from "../mongoose/schemas/booking.mjs";
import { redirect } from "../handlers/auth.mjs";
import 'dotenv/config';
describe("google user ", () => {
    let app;
    let jwt;
    beforeAll(() => {
        mongoose
            .connect(process.env.MONGODB_TEST)
            .then(() => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
        app = createApp();

    })

    it("ensure a google-authenticated user can't change password", async () => {
        // creating user in database
        const newUser = new User({
            email: "lnd@gmail.com",
            firstName: "Joe",
            lastName: "Foe",
            authMethod: "google",
            verified: true
        });
        let savedUser = await newUser.save();
        let user = await User.findOne({ email: "lnd@gmail.com" });
        expect(user.email).toBe("lnd@gmail.com")

        // getting csrf token
        let response = await request(app)
            .get("/api/csrf-token")
            .set('Accept', 'application/json')
            .withCredentials(); // Ensure cookies are included in the request
        expect(response.statusCode).toBe(200)
        let csrfToken = response.body.csrfToken
        let csrfTokenCookie = response.headers['set-cookie'];
        expect(csrfToken).toBeDefined()

        let reqBody = {
            email: "lnd@gmail.com"
        }
        response = await request(app).post("/api/auth/verifyemail")
            .set("Cookie", csrfTokenCookie).set("X-CSRF-Token", csrfToken)
            .set('Content-Type', 'application/json').send(reqBody).send(reqBody)
        expect(response.statusCode).toBe(400)

    }, 10 * 1000)

    afterAll(async () => {
        // Disconnect from the database
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("Disconnected from Test Database");
    });
})