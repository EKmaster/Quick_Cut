import request from "supertest"
import app from "../server.mjs"

describe("user sign up", () => {
    it("successfully sign's a user up, adding them to the database, and sending a JWT back", async () => {
        // getting csrf token
        var response = await request(app).get("/api/csrf-token")
        expect(response.statusCode).toBe(200)
        const csrfToken = response.body.csrfToken
        expect(csrfToken).toBeDefined()
        
        const reqBody = {
            email: "d3m213in3i@d32.com",
            password: "n12ein1",
            firstName: "Joe",
            lastName: "Steven"
        }
        response = await request(app).post("/api/auth/signup")
            .set('X-CSRF-Token', csrfToken)
            .set('Content-Type', 'application/json').send(reqBody)

        expect(response.statusCode).toBe(200)
    })
})