import { User } from "../../mongoose/schemas/user.mjs";
import { setdefaultlocation } from "../../handlers/settings.mjs";

jest.mock("../../mongoose/schemas/user.mjs",)

describe('setdefaultlocation', () => {
    let mockRequest, mockResponse, mockUser;

    beforeEach(() => {
        mockRequest = {
            user: { id: '12345' },  // Mock user ID
            body: {
                googlePlacesID: 'xyz789',
                additionalDetails: 'Building 202'
            }
        };
        mockResponse = {
            sendStatus: jest.fn()
        };
        mockUser = {
            defaultLocation: {},
            save: jest.fn().mockResolvedValue(true)  // Mock save method
        };
    });

    it('should set the defaultLocation and return status 200', async () => {
        User.findById.mockResolvedValue(mockUser);

        await setdefaultlocation(mockRequest, mockResponse);

        expect(User.findById).toHaveBeenCalledWith('12345');
        expect(mockUser.defaultLocation).toEqual({
            googlePlacesID: 'xyz789',
            additionalDetails: 'Building 202'
        });
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);
    });

    it('should return status 500 if there is an error', async () => {
        User.findById.mockRejectedValue(new Error('Database error'));

        await setdefaultlocation(mockRequest, mockResponse);

        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
    });
});
