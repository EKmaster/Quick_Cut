
jest.mock("../../mongoose/schemas/user.mjs",)
jest.mock("../../mongoose/schemas/booking.mjs")
import { User } from "../../mongoose/schemas/user.mjs";
import { Booking } from "../../mongoose/schemas/booking.mjs";
import { overviewProfileInfo } from "../../handlers/settings.mjs";

describe("overview profile information", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("should return status 500 if profile overview data could not be fully loaded", () => {
        const mockRequest = {
            user: {
                id: "f32n23io2"
            }
        }
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        // CREATE MOCK USER DATA 
        User.findById.mockResolvedValue(null)

        overviewProfileInfo(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(500)
            expect(mockResponse.status).toHaveBeenCalledWith(500)
        })
    })

    it("should return status 200 and the profile overview data if it was sucessfully loaded", () => {
        const mockRequest = {
            user: {
                id: "f32n23io2"
            }
        }
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        const mockUser = {
            userName: "billy99",
            firstName: "Billy",
            lastName: "Joe"
        }
        const time = new Date()
        const mockBookings = [{
            _id: "d1212d31",
            timing: time,
            status: "pending",
            service: "haircut"
        },{
            _id: "f213n131i",
            timing: time,
            status: "completed",
            service: "haircut"
        }]
        const expectedActiveBookings = [{
            id: "d1212d31",
            time:time,
            status: "pending",
            description: "haircut"  
        }]
        const expectedPastBookings = [{
            id: "f213n131i",
            time: time,
            status: "completed",
            description: "haircut"         
        }]
        User.findById.mockResolvedValue(mockUser)
        Booking.find.mockResolvedValue(mockBookings)

        overviewProfileInfo(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(200)
            expect(mockResponse.json).toHaveBeenCalledWith({
                username: "billy99",
                fullName: "Billy Joe",
                activeBookings: expectedActiveBookings,
                pastBookings: expectedPastBookings
            })
        })
    })

})