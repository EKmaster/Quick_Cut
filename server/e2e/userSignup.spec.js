import request from "supertest"
import { createApp } from "../utils/createApp.mjs"
import mongoose from "mongoose"
import { response } from "express";
import { User } from "../mongoose/schemas/user.mjs";


describe("user sign up process", () => {
    let app;
    let jwt;
    beforeAll(() => {
        mongoose
            .connect("mongodb+srv://omerkhan5002:3Nz0bihPwrbkcgps@cluster0.sd9uxwv.mongodb.net/test")
            .then(() => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
        app = createApp();

    })
    it("successfully registers and verifies a user", async () => {
        // getting csrf token
        let response = await request(app)
            .get("/api/csrf-token")
            .set('Accept', 'application/json')
            .withCredentials(); // Ensure cookies are included in the request
        expect(response.statusCode).toBe(200)
        let csrfToken = response.body.csrfToken
        let csrfTokenCookie = response.headers['set-cookie'];
        expect(csrfToken).toBeDefined()

        // sending request 
        let reqBody = {
            email: "d3m213in3i@d32.com",
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

        // checking if user is successfully authorized
        response = await request(app).get("/api/auth/status").set("Cookie", jwt)
        expect(response.statusCode).toBe(200)

        var user = await User.findOne({ email: "d3m213in3i@d32.com" })
        expect(user).toBeDefined()
        expect(user.firstName).toBe("Joe")
        expect(user.lastName).toBe("Steven")
        expect(user.verified).toBe(false)

        // sending verification code and ensuring it exists in database
        response = await request(app).get("/api/auth/sendverificationcode").set("Cookie", jwt)
        expect(response.statusCode).toBe(200)
        user = await User.findOne({ email: "d3m213in3i@d32.com" })
        const verificationCode = user.verificationCode.code
        expect(verificationCode).toBeDefined()

        // submitting the verification code and getting verified
        reqBody = { submittedCode: user.verificationCode.code }
        response = await request(app).post("/api/auth/submitverificationcode")
            .set("Cookie", `${jwt}; ${csrfTokenCookie}`)
            .set("X-CSRF-Token", csrfToken)
            .set('Content-Type', 'application/json').send(reqBody)
        expect(response.statusCode).toBe(200)
        user = await User.findOne({ email: "d3m213in3i@d32.com" })
        expect(user.verified).toBe(true)
        expect(user.verificationCode).toEqual({})

        // setting a default location
        reqBody = { googlePlacesID: "ChIJKQDzOA41K4gRajQDdyzD990", additionalDetails: "main entrance" }
        response = await request(app).post("/api/settings/setdefaultlocation")
            .set("Cookie", `${jwt}; ${csrfTokenCookie}`)
            .set("X-CSRF-Token", csrfToken)
            .set('Content-Type', 'application/json').send(reqBody)
        expect(response.statusCode).toBe(200)
        user = await User.findOne({ email: "d3m213in3i@d32.com" })
        expect(user.defaultLocation.googlePlacesID).toBe("ChIJKQDzOA41K4gRajQDdyzD990")
        expect(user.defaultLocation.additionalDetails).toBe("main entrance")
    })

    afterAll(async () => {
        // Disconnect from the database
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("Disconnected from Test Database");
    });
})