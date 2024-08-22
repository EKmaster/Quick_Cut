jest.mock("../../mongoose/schemas/user.mjs",)
import { User } from "../../mongoose/schemas/user.mjs";
import { verifyEmail } from "../../handlers/auth.mjs"

describe("verify email", () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("should return status 400 and appropriate message if google-authenticated user attempts to change passowrd", () => {
        const mockUser = {
            authMethod: "google",
        }
        const mockRequest = {
            body: {
                email: "test@gmail.com"
            }
        }
        const mockResponse = {
            send: jest.fn(),
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
        }
        User.findOne.mockResolvedValue(mockUser)

        verifyEmail(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.send).toHaveBeenCalledWith("Can not change password Google account.")
        })
    })

    it("should return status 200 if user exists in the database as a non-google-authenticated account", () => {
        const mockUser = {
            authMethod: "local"
        }
        const mockRequest = {
            body: {
                email: "test@gmail.com"
            }
        }
        const mockResponse = {
            send: jest.fn(),
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
        }
        User.findOne.mockResolvedValue(mockUser)

        verifyEmail(mockRequest, mockResponse).then(() => {
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
        })
    })

    it ("should return status 404 if user is not found in database", () => {
        const mockRequest = {
            body: {
                email: "test@gmail.com"
            }
        }
        const mockResponse = {
            send: jest.fn(),
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
        }
        User.findOne.mockResolvedValue(null)

        verifyEmail(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(404)
            expect(mockResponse.send).toHaveBeenCalledWith("User not found.")
        })
    })

})