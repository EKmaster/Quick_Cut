import request from "supertest"
import { createApp } from "../utils/createApp.mjs"
import mongoose from "mongoose"
import { response } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { Booking } from "../mongoose/schemas/booking.mjs";
import 'dotenv/config';

describe("reset password", () => {
    let app;
    let jwt;
    beforeAll(() => {
        mongoose
            .connect(process.env.MONGODB_TEST)
            .then(() => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
        app = createApp();

    })

    it("should signup then logout to reset password and then log back int", async () => {
        // getting csrf token
        let response = await request(app)
            .get("/api/csrf-token")
            .set('Accept', 'application/json')
            .withCredentials(); // Ensure cookies are included in the request
        expect(response.statusCode).toBe(200)
        let csrfToken = response.body.csrfToken
        let csrfTokenCookie = response.headers['set-cookie'];
        expect(csrfToken).toBeDefined()

        // sending request to sign up
        let reqBody = {
            email: "tky@hnd.com",
            password: "n12ein1",
            firstName: "Joe",
            lastName: "Steven"
        }
        response = await request(app).post("/api/auth/signup")
            .set('X-CSRF-Token', csrfToken).set('Cookie', csrfTokenCookie)
            .set('Content-Type', 'application/json').send(reqBody)
        expect(response.statusCode).toBe(200)
        jwt = response.headers['set-cookie'];
        expect(jwt).toBeDefined()

        // ensuring user is signed up
        response = await request(app).get("/api/auth/status").set("Cookie", jwt)
        expect(response.statusCode).toBe(200)

        // logging out 
        response = await request(app).post("/api/auth/logout")
            .set("Cookie", `${jwt}; ${csrfTokenCookie}`)
            .set("X-CSRF-Token", csrfToken)
        jwt = response.headers['set-cookie']
        response = await request(app).get("/api/auth/status").set("Cookie", jwt)
        expect(response.statusCode).toBe(401)

        // PASSWORD RESET PROCESS BELOW

        // verifying email exists
        reqBody = {
            email: "tky@hnd.com"
        }
        response = await request(app).post("/api/auth/verifyemail")
            .set("Cookie", csrfTokenCookie).set("X-CSRF-Token", csrfToken)
            .set('Content-Type', 'application/json').send(reqBody).send(reqBody)
        expect(response.statusCode).toBe(200)

        // sending email verification code
        response = await request(app).get("/api/auth/sendverificationcode?purpose=reset&email=tky@hnd.com")
        expect(response.statusCode).toBe(200)
        var user = await User.findOne({ email: "tky@hnd.com" })
        const verificationCode = user.verificationCode.code
        expect(verificationCode).toBeDefined()

        // submitting the verificaiton code to prove account ownership
        reqBody = { submittedCode: verificationCode }
        response = await request(app).post("/api/auth/submitverificationcode?purpose=reset&email=tky@hnd.com")
            .set("Cookie", csrfTokenCookie).set("X-CSRF-Token", csrfToken)
            .set('Content-Type', 'application/json').send(reqBody).send(reqBody)
        expect(response.statusCode).toBe(200)

        // resetting password
        reqBody = { email: "tky@hnd.com", password: "qwerty" }
        response = await request(app).post("/api/auth/forgot-password")
            .set("Cookie", `${jwt}; ${csrfTokenCookie}`)
            .set("X-CSRF-Token", csrfToken)
            .set('Content-Type', 'application/json').send(reqBody)
        expect(response.statusCode).toBe(200)
        user = await User.findOne({ email: "tky@hnd.com" })

        // logging in with new password
        reqBody = { email: "tky@hnd.com", password: "qwerty" }
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