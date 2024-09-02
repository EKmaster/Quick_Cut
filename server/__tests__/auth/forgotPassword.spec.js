import { User } from "../../mongoose/schemas/user.mjs";
import { forgotPassword } from "../../handlers/auth.mjs";
import bcrypt from "bcryptjs";
jest.mock("../../mongoose/schemas/user.mjs")
jest.mock('bcryptjs', () => ({
    hash: jest.fn()
}));


describe("forgot password endpoint", () => {
    let mockRequest, mockResponse;
    beforeEach(() => {
        jest.resetAllMocks()
        mockRequest = {
            body: {
                email: "test@example.com",
                password: "abc",
            }
        }
         mockResponse = {
            sendStatus: jest.fn(),
            status: jest.fn(),
        }
        
    })
    it("should return send status 200 when user is found and password is changed", async () => {
        const mockUser = {
            email: "test@example.com",
            password: "123",
            save: jest.fn()
        }
        User.findOne.mockResolvedValue(mockUser) 
        bcrypt.hash.mockResolvedValue("hashed_abc");
        await forgotPassword(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        const hashedPassword = await bcrypt.hash("abc", 10);
        expect(hashedPassword).toBe("hashed_abc")
        expect(bcrypt.hash).toHaveBeenCalledWith("abc", 10)
        expect(mockUser.password).toBe("hashed_abc")
        expect(mockUser.save).toHaveBeenCalled()
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
    })
    it("should return send status 400 when user is not found", async () => {
        const mockUser = null
        User.findOne.mockResolvedValue(mockUser) 
        
        await forgotPassword(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        
        expect(bcrypt.hash).not.toHaveBeenCalledWith("abc", 10)
        
        
        expect(mockResponse.status).toHaveBeenCalledWith(404)
    })
    it("should return send status 500 database error happens", async () => {
        const mockUser = null
        User.findOne.mockRejectedValue(new Error('Some error'));
        
        await forgotPassword(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        
        expect(bcrypt.hash).not.toHaveBeenCalledWith("abc", 10)
        
        
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
    })
})