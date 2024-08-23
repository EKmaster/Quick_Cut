jest.mock("../../mongoose/schemas/booking.mjs")
import { Booking } from "../../mongoose/schemas/booking.mjs"
import { book } from "../../handlers/bookings.mjs"

describe("book haircut", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("should return status 400, and an appropriate message if no request body, thus failing to book request", () => {
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        book({}, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.send).toHaveBeenCalledWith("Invalid request data")
        })
    })

    it("should return status 400, and an appropriate message if invalid request body, thus failing to book request", () => {
        const mockRequest = { user: {}, body: {} }
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        Booking.prototype.save = jest.fn(() => { throw new Error("invalid data") })

        book(mockRequest, mockResponse).then(() => {
            expect(mockResponse.status).toHaveBeenCalledWith(400)
            expect(mockResponse.send).toHaveBeenCalledWith("Invalid request data")
        })
    })

    it("should return status 200 and make booking with the correct price if all request data is valid", () => {
        const mockRequest = {
            user: {
                id: "e1n21231"
            },
            body: {
                service: "haircut",
                beard: false,
                haircutDetails: "short",
                timing: new Date,
                locationGooglePlacesID: "f32n3dn23234",
                locationDetails: "apartment 120A",
                status: "pending"
            },
        }
        const bookingData = {
            bookerID: "e1n21231",
            service: "haircut",
            beard: false,
            haircutDetails: "short",
            timing: new Date,
            locationGooglePlacesID: "f32n3dn23234",
            locationDetails: "apartment 120A",
            status: "pending",
            price: 40
        }
        const mockResponse = {sendStatus: jest.fn()}
        Booking.prototype.save = jest.fn(() => {})

        book(mockRequest, mockResponse).then(() => {
            expect(Booking).toHaveBeenCalledWith(bookingData)
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
        })

    })
})