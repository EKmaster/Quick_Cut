jest.mock("../mongoose/schemas/user.mjs",)
jest.mock("../utils/createJWT.mjs")
import { User } from "../mongoose/schemas/user.mjs";
import { signup, sendVerificationCode, verifyEmail, status } from "../handlers/auth.mjs"
import { createJWT } from "../utils/createJWT.mjs";

describe("signup endpoint", () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("should not allow new user to be created using email of an already-existing user", () => {
        //configuring test
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

        User.findOne.mockResolvedValue({ email: 'test@example.com' })

        signup(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "User already exists" })
        })
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
        signup(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.json).toHaveBeenCalledWith({ message: "No password given" })
        })
    })

    it("should be allowed to create new user if email is unique and password exists", () => {
        const mockRequest = {
            body: {
                email: "test@example.com",
                password: "13123n132"
            }
        }
        const mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        User.findOne.mockResolvedValue(null)


        signup(mockRequest, mockResponse).then(() => {
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
            expect(createJWT).toHaveBeenCalled()
        })
    })

})