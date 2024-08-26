import { verfied } from "../../handlers/auth.mjs";
import { User } from "../../mongoose/schemas/user.mjs";
jest.mock("../../mongoose/schemas/user.mjs")
describe("verfied endpoint", () => {
    let mockRequest, mockResponse;
    beforeEach(() => {
        jest.resetAllMocks()
        mockRequest = {
            user: {
                id: 12345
            },
            
        }
         mockResponse = {
            sendStatus: jest.fn(),
        }
        
        
    })
    it("should return status 200 when user is found and is verified", async () => {
        const mockUser = {
            verified: 
                true
        }
        User.findById.mockResolvedValue(mockUser) 
        await verfied(mockRequest, mockResponse)
        
        expect(User.findById).toHaveBeenCalledWith(12345)
        
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
    })
    it("should return status 401 when is not verified", async () => {
        const mockUser = {
            verified: 
                false
        }
        User.findById.mockResolvedValue(mockUser) 
        await verfied(mockRequest, mockResponse)
        
        expect(User.findById).toHaveBeenCalledWith(12345)
        
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401)
    })
    it("should return status 500 when datbase problem happens", async () => {
        
        User.findOne.mockRejectedValue(new Error('Some error'));
        await verfied(mockRequest, mockResponse)
        
        expect(User.findById).toHaveBeenCalledWith(12345)
        
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500)
    })

})


