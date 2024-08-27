import { defaultlocation } from '../../handlers/settings.mjs';
import { User } from "../../mongoose/schemas/user.mjs";

jest.mock("../../mongoose/schemas/user.mjs",)

describe('defaultlocation', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = {
            user: { id: '12345' } // Mock the user ID in the request
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(), // Allows for method chaining
            json: jest.fn(),
            sendStatus: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return locationID and additionalDetails if defaultLocation exists', async () => {
        const mockUser = {
            defaultLocation: {
                googlePlacesID: 'place123',
                additionalDetails: 'Near the park'
            }
        };

        User.findById.mockResolvedValue(mockUser);

        await defaultlocation(mockRequest, mockResponse);

        expect(User.findById).toHaveBeenCalledWith('12345');
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            locationID: 'place123',
            additionalDetails: 'Near the park'
        });
    });

    it('should return null for locationID and additionalDetails if defaultLocation does not exist', async () => {
        const mockUser = {}; // No defaultLocation in user

        User.findById.mockResolvedValue(mockUser);

        await defaultlocation(mockRequest, mockResponse);

        expect(User.findById).toHaveBeenCalledWith('12345');
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            locationID: null,
            additionalDetails: null
        });
    });

    it('should return 500 if an error occurs', async () => {
        User.findById.mockRejectedValue(new Error('Database error'));

        await defaultlocation(mockRequest, mockResponse);

        expect(User.findById).toHaveBeenCalledWith('12345');
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
    });
});
