import { User } from "../mongoose/schemas/user.mjs";
import { signup, sendVerificationCode, verifyEmail, status } from "../handlers/auth.mjs"

jest.mock("../mongoose/schemas/user.mjs", () => {
    return {
        User: {
            findOne: jest.fn()
        }
    }
})

describe("signup endpoint", () => {

    it("should not allow new user to be created using email of an already-existing user", () => {
        //configuring test
        const mockRequest = {
            body: {
                email: "test@example.com"
            }
        }
        const mockResponse = {
            sendStatus: jest.fn(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        User.findOne.mockResolvedValue({ email: 'test@example.com' })

        signup(mockRequest, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.json).toHaveBeenCalledWith({message: "User already exists"})
    })

    it("should not allow new user to be created if password field is empty", () => {
        const mockRequest = {
            body: {
                email: "test@example.com"
            }
        }
        const mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        User.findOne.mockResolvedValue(null)
        signup(mockRequest, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.json).toHaveBeenCalledWith({message: "No password given"})
    })

    it("should be allowed to create new user if email is unique and password exists", () => {
        const mockRequest = {
            body: {
                email: "test@example.com",
                password: "12e13231"
            }
        }
        const mockResponse = {
            sendStatus: jest.fn(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        User.findOne.mockResolvedValue(null)
        signup(mockRequest, mockResponse)
        expect(mockRequest.sendStatus).toHaveBeenCalledWith(200)
    })

})