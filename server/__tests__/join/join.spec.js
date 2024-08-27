import { App } from '../../mongoose/schemas/apps.mjs';
import { join } from '../../handlers/join.mjs';

jest.mock('../../mongoose/schemas/apps.mjs');  // Mock the App model

describe('join endpoint', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = {
            user: { id: '12345' },  // Mock user ID
            body: {
                fullName: 'John Doe',
                address: '123 Main St',
                mobileNumber: '555-555-5555',
                cardNumber: '1234567890123456',
                expirationDate: '12/24'
            },
            files: {
                id: [{ location: 'https://example.com/id.jpg' }],
                resume: [{ location: 'https://example.com/resume.pdf' }],
                equipment: [{ location: 'https://example.com/equipment.jpg' }]
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should save the application and return status 200 with file URLs', async () => {
        const mockApp = {
            save: jest.fn().mockResolvedValue(true)
        };
        App.mockImplementation(() => mockApp);

        await join(mockRequest, mockResponse);

        expect(App).toHaveBeenCalledWith({
            userID: '12345',
            fullName: 'John Doe',
            address: '123 Main St',
            number: '555-555-5555',
            cardNumber: '1234567890123456',
            expiry: '12/24',
            id: 'https://example.com/id.jpg',
            resume: 'https://example.com/resume.pdf',
            equipment: 'https://example.com/equipment.jpg'
        });
        expect(mockApp.save).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Files uploaded and data saved',
            resumeUrl: 'https://example.com/resume.pdf',
            idUrl: 'https://example.com/id.jpg',
            equipmentUrl: 'https://example.com/equipment.jpg'
        });
    });

    it('should return status 500 if an error occurs', async () => {
        App.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Database error'))
        }));

        await join(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Error uploading files or saving data',
            details: expect.any(Error)
        });
    });
});
