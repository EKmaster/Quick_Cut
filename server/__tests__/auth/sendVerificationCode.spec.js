jest.mock("../../mongoose/schemas/user.mjs",)
import { User } from "../../mongoose/schemas/user.mjs";
import {sendVerificationCode} from "../../handlers/auth.mjs"

describe("send verification code", () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("returns status 200 and the time until a new code can be sent if a valid code already exists and is less than 2 minutes old", () => {
        const mockUser = {
            verificationCode: {
                code: 12345,
                expiryTime: new Date(new Date().getTime() + 9 * 60 * 1000)
            }
        }
        const mockRequest = {
            query: {
                purpose: "reset"
            }
        }
        const mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        User.findOne.mockResolvedValue(mockUser)

        sendVerificationCode(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(200)
            expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
                secondsUntilNewCodeSend: expect.any(Number),
            }))
            const seconds = mockResponse.json.mock.calls[0][0].secondsUntilNewCodeSend
            expect(seconds).toBeGreaterThanOrEqual(0);
            expect(seconds).toBeLessThanOrEqual(120);
        })

    })

    it("returns status 200 and sets a new verification code if one already exists but is more than 2 minutes old", () => {
        const mockUser = {
            verificationCode: {
                code: 12345,
                expiryTime: new Date(new Date().getTime() + 3 * 60 * 1000)
            },
            save: jest.fn()
        }
        const mockRequest = {
            query: {
                purpose: "reset"
            }
        }
        const mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        User.findOne.mockResolvedValue(mockUser)

        sendVerificationCode(mockRequest, mockResponse).then(() => {
            expect(mockUser.save).toHaveBeenCalled()
            expect(mockResponse.status).toHaveBeenCalledWith(200)
            expect(mockResponse.json).toHaveBeenCalledWith({ secondsUntilNewCodeSend: 0 })
        })
    })

    it("returns status 200 and sets a new verification code if none exists", () => {
        const mockUser = {
            save: jest.fn()
        }
        const mockRequest = {
            query: {
                purpose: "reset"
            }
        }
        const mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        User.findOne.mockResolvedValue(mockUser)

        sendVerificationCode(mockRequest, mockResponse).then(() => {
            expect(mockUser.save).toHaveBeenCalled()
            expect(mockResponse.status).toHaveBeenCalledWith(200)
            expect(mockResponse.json).toHaveBeenCalledWith({ secondsUntilNewCodeSend: 0 })
        })
    })

    it("returns status 500 if some other error not already handled is thrown", () => {
        const mockResponse = {sendStatus: jest.fn()}
        sendVerificationCode({}, mockResponse).then(() => {
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
        })
    })
})