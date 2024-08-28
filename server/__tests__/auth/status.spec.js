jest.mock("../../mongoose/schemas/user.mjs",)
import { User } from "../../mongoose/schemas/user.mjs";
import { status } from "../../handlers/auth.mjs"

describe("authentication status", () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    it("should return status 200 if user authenticated", () => {
        const mockRequest = {user: "test user"}
        const mockResponse = {sendStatus: jest.fn()}
        status(mockRequest, mockResponse)
        //expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200)
    })

    it("should return status 401 if no user authenticated", () => {
        const mockResponse = {sendStatus: jest.fn()}
        status({}, mockResponse)
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(401)
    })

})