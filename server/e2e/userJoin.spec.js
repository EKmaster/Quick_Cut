import request from "supertest"
import { createApp } from "../utils/createApp.mjs"
import mongoose from "mongoose"
import { response } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import path from "path";
import 'dotenv/config';
import dotenv from 'dotenv';
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';

import AWS from "aws-sdk"
dotenv.config({ path: '../.env' });

let keys = []
describe("user join", () => {
    let app;
    let jwt;
    beforeAll(() => {
        mongoose
            .connect("mongodb+srv://omerkhan5002:3Nz0bihPwrbkcgps@cluster0.sd9uxwv.mongodb.net/test")
            .then(() => console.log("Connected to Test Database"))
            .catch((err) => console.log(`Error: ${err}`));
        app = createApp();

    })

    it("should signup then let user join", async () => {
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
            .send(reqBody)
        expect(response.statusCode).toBe(200)
        jwt = response.headers['set-cookie'];
        expect(jwt).toBeDefined()

        // ensuring user is signed up
        response = await request(app).get("/api/auth/status").set("Cookie", jwt)
        expect(response.statusCode).toBe(200)


        // Simulating file upload and form submission for /api/join
        response = await request(app).post("/api/join")
            .set('X-CSRF-Token', csrfToken)
            .set('Cookie', jwt.concat(csrfTokenCookie))  // Merging cookies
            .field("fullName", "Joe Steven")
            .field("address", "123 Main St")
            .field("mobileNumber", "1234567890")
            .field("cardNumber", "4111111111111111")
            .field("expirationDate", "12/24")
            .field("purpose", true)
            .attach("resume", path.join(__dirname, '..', 'utils', 'test.jpg'))  // Correct path
            .attach("id", path.join(__dirname, '..', 'utils', 'test.jpg'))
            .attach("equipment", path.join(__dirname, '..', 'utils', 'test.jpg'));
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Files uploaded and data saved');
        
        keys = response.body.keys

    }, 10 * 1000)

    afterAll(async () => {
        // Disconnect from the database
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
          });
          const s3 = new S3Client({
            region: process.env.AWS_REGION,
            

            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
          });
          
          if (keys.length > 0) {
            const deleteParams = {
                Bucket: 'cuickcutapply2005',
                Delete: {
                    Objects: keys.map((key) => ({ Key: key })),
                    Quiet: true
                }
            };

            try {
                const data = await s3.send(new DeleteObjectsCommand(deleteParams));
                console.log("Delete Success", data);
            } catch (err) {
                console.log("Error deleting objects:", err);
            }
        }

          
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("Disconnected from Test Database");
    });
})