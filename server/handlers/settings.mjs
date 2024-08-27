import { User } from "../mongoose/schemas/user.mjs";
import { Booking } from "../mongoose/schemas/booking.mjs";

export const overviewProfileInfo = async (req, res) => {
    const data = {
        fullName: null,
        activeBookings: null,
        pastBookings: null
    }
    // getting username and full name

    try {
        const user = await User.findById(req.user.id)
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
    } catch (err) {}

    if (data.fullName && data.activeBookings && data.pastBookings) {
        res.status(200)
        return res.json(data)
    }
    return res.status(500)
}


export const defaultlocation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if ("defaultLocation" in user) {
            const locationID = user.defaultLocation.googlePlacesID
            const additionalDetails = user.defaultLocation.additionalDetails
            res.status(200)
            res.json({ locationID: locationID, additionalDetails: additionalDetails })
        }else{
            res.status(200)
            res.json({ locationID: null, additionalDetails: null })
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}


export const cleardefaultlocation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        user.defaultLocation = {}
        user.save()
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
} 

export const setdefaultlocation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const googlePlacesID = req.body.googlePlacesID
        const additionalDetails = req.body.additionalDetails

        user.defaultLocation = {
            googlePlacesID: googlePlacesID,
            additionalDetails: additionalDetails
        }
        await user.save()
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
}
