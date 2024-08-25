import { User } from "../../mongoose/schemas/user.mjs";
import { status, submitverificationcode } from "../../handlers/auth.mjs";
import { query } from "express";
jest.mock("../../mongoose/schemas/user.mjs")

describe("submit verfication code endpoint", () => {
    let mockRequest, mockResponse;
    beforeEach(() => {
        jest.resetAllMocks()
        
        
    })
    it("should return status 200 and verified true when code is found, not expired, save works, and code is correct", async () => {
        mockRequest = {
            body: {
                submittedCode: 12345
            },
            query: {
                purpose: "reset",
                email: "test@example.com"
            }
        }
         mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn(),
            json: jest.fn()
        }
        const mockUser = {
            verificationCode: {
                code: 12345,
                expiryTime: new Date(new Date().getTime() + 9 * 60 * 1000),
                
            },
            save: jest.fn()
        }
        User.findOne.mockResolvedValue(mockUser) 
        
        await submitverificationcode(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        expect(mockUser.save).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({verified: true})
    })
    it("should return status 200 and verified false when code is incorrect", async () => {
        mockRequest = {
            body: {
                submittedCode: 1234
            },
            query: {
                purpose: "reset",
                email: "test@example.com"
            }
        }
         mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn(),
            json: jest.fn()
        }
        const mockUser = {
            verificationCode: {
                code: 12345,
                expiryTime: new Date(new Date().getTime() + 9 * 60 * 1000),
                
            },
            save: jest.fn()
        }
        User.findOne.mockResolvedValue(mockUser) 
        
        await submitverificationcode(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        expect(mockUser.save).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({verified: false})
    })
    it("should return status 400 when code is expired", async () => {
        mockRequest = {
            body: {
                submittedCode: 12345
            },
            query: {
                purpose: "reset",
                email: "test@example.com"
            }
        }
         mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn(),
            json: jest.fn()
        }
        const mockUser = {
            verificationCode: {
                code: 12345,
                expiryTime: new Date(new Date().getTime() - 9 * 60 * 1000),
                
            },
            save: jest.fn()
        }
        User.findOne.mockResolvedValue(mockUser) 
        
        await submitverificationcode(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        expect(mockUser.save).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.json).not.toHaveBeenCalled()
    })
    it("should return status 400 when code does not exist", async () => {
        mockRequest = {
            body: {
                submittedCode: 12345
            },
            query: {
                purpose: "reset",
                email: "test@example.com"
            }
        }
         mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn(),
            json: jest.fn()
        }
        const mockUser = {
            verificationCode: {
                expiryTime: new Date(new Date().getTime() - 9 * 60 * 1000),
                
            },
            save: jest.fn()
        }
        User.findOne.mockResolvedValue(mockUser) 
        
        await submitverificationcode(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        expect(mockUser.save).not.toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.json).not.toHaveBeenCalled()
    })
    it("should return status 400 when code does not exist", async () => {
        mockRequest = {
            query: {
                purpose: "reset",
                email: "test@example.com"
            }
        }
         mockResponse = {
            sendStatus: jest.fn(),
            json: jest.fn()
        }
        User.findOne.mockRejectedValue(new Error('Some error'));
        
        await submitverificationcode(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
        expect(mockResponse.json).not.toHaveBeenCalled()
    })
})