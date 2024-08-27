import { User } from "../../mongoose/schemas/user.mjs";
import { cleardefaultlocation } from "../../handlers/settings.mjs";

jest.mock("../../mongoose/schemas/user.mjs",)

describe('cleardefaultlocation', () => {
    let mockRequest, mockResponse, mockUser;

    beforeEach(() => {
        mockRequest = {
            user: { id: '12345' }  // Mock user ID
        };
        mockResponse = {
            sendStatus: jest.fn()
        };
        mockUser = {
            defaultLocation: { googlePlacesID: 'abc123', additionalDetails: 'Suite 101' },
            save: jest.fn().mockResolvedValue(true)  // Mock save method
        };
    });

    it('should clear the defaultLocation and return status 200', async () => {
        User.findById.mockResolvedValue(mockUser);

        await cleardefaultlocation(mockRequest, mockResponse);

        expect(User.findById).toHaveBeenCalledWith('12345');
        expect(mockUser.defaultLocation).toEqual({});
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should return status 500 if there is an error', async () => {
        User.findById.mockRejectedValue(new Error('Database error'));

        await cleardefaultlocation(mockRequest, mockResponse);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
    });
});
