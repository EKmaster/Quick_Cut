import { User } from "../mongoose/schemas/user.mjs";
import { Booking } from "../mongoose/schemas/booking.mjs";

export const overviewProfileInfo = async (req, res) => {
    const data = {
        username: null,
        fullName: null,
        activeBookings: null,
        pastBookings: null
    }
    // getting username and full name

    try {
        const user = await User.findById(req.user.id)
        data.username = user.userName
        data.fullName = user.firstName + " " + user.lastName
    } catch (err) { }

    // getting active and past bookings
    try {
        const bookings = await Booking.find({ bookerID: req.user.id })
        const loadedActiveBookings = bookings.filter(item => item.status === "pending")
        data.activeBookings = loadedActiveBookings.map(booking => ({
            id: booking._id,
            time: booking.timing,
            status: "pending",
            description: booking.service
        }))

        const loadedPastBookings = bookings.filter(item => item.status !== "pending")
        data.pastBookings = loadedPastBookings.map(booking => ({
            id: booking._id,
            time: booking.timing,
            status: booking.status,
            description: booking.service
        }))
    } catch (err) { }

    // sending data back to client as json
    res.status(200)
    return res.json(data)
}