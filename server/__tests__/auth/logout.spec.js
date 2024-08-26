import { logout } from "../../handlers/auth.mjs";

describe("logout endpoint", () => {
    let mockRequest, mockResponse;
    beforeEach(() => {
        jest.resetAllMocks()
        mockRequest = {}
         mockResponse = {
            sendStatus: jest.fn(),
            clearCookie: jest.fn()
        }
        
        
    })
    it("should return status 200 and clear the cookie", async () => {
        
        await logout(mockRequest, mockResponse)
        expect(mockResponse.clearCookie).toHaveBeenCalledWith("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
    })
    

})


