import { login } from "../../handlers/auth.mjs";
import { createJWT } from "../../utils/createJWT.mjs";
import { User } from "../../mongoose/schemas/user.mjs";
import bcrypt from "bcryptjs";
jest.mock("../../utils/createJWT.mjs")
jest.mock("../../mongoose/schemas/user.mjs")
jest.mock('bcrypt', () => ({
    compareSync: jest.fn()
}));


describe("login endpoint", () => {
    let mockRequest, mockResponse;
    beforeEach(() => {
        jest.resetAllMocks()
         mockRequest = {
            body: {
                email: "test@example.com",
                password: "123"
            }
        }
         mockResponse = {
            sendStatus: jest.fn()
            
        }
        
    })
    it("should return status 401 when user is not found", async () => {
        

        User.findOne.mockResolvedValue(null) 
        await login(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({email: "test@example.com"})
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401)
    } )
    it("should return status 401 when password is incorrect", async () => {
        
        const findUserMock = { email: 'test@example.com', password: 'hashedpassword' };
        User.findOne.mockResolvedValue(findUserMock);
        bcrypt.compareSync.mockReturnValue(false);
        await login(mockRequest, mockResponse)
        expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
        expect(bcrypt.compareSync).toHaveReturnedWith(false)
        expect(bcrypt.compareSync).toHaveBeenCalledWith('123', 'hashedpassword');

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401)


    })
    it('should return 401 if an error is thrown', async () => {
        User.findOne.mockRejectedValue(new Error('Some error'));

        await login(mockRequest, mockResponse);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
    });

    it("should return 200 and create JWT for user, if login is succesful", async () => {
        const findUserMock = { email: 'test@example.com', password: 'hashedpassword' };
        User.findOne.mockResolvedValue(findUserMock);
        bcrypt.compareSync.mockReturnValue(true);
    await login(mockRequest, mockResponse);
    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.compareSync).toHaveBeenCalledWith('123', 'hashedpassword');
        expect(createJWT).toHaveBeenCalledWith(findUserMock, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);

    })

    
})