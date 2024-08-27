import { User } from "../../mongoose/schemas/user.mjs";
import { redirect } from "../../handlers/auth.mjs";
import { createJWT } from "../../utils/createJWT.mjs";

jest.mock("../../mongoose/schemas/user.mjs",)
jest.mock('../../utils/createJWT.mjs');  // Mock the createJWT function

describe('redirect', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = {
            user: { savedUser: { email: 'test@example.com' } }  // Mock user with email
        };
        mockResponse = {
            redirect: jest.fn(),
            sendStatus: jest.fn()
        };
    });

    it('should create a JWT and redirect to the specified URL if the user is found', async () => {
        const mockUser = { email: 'test@example.com' };
        User.findOne.mockResolvedValue(mockUser);

        await redirect(mockRequest, mockResponse);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(createJWT).toHaveBeenCalledWith(mockUser, mockResponse);
        expect(mockResponse.redirect).toHaveBeenCalledWith('http://localhost:3000');
    });

    it('should return status 401 if the user is not found', async () => {
        User.findOne.mockResolvedValue(null);  // Simulate user not found

        await redirect(mockRequest, mockResponse);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should return status 401 if an error occurs', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        await redirect(mockRequest, mockResponse);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401);
    });
});
