import { Router } from "express"
import { User } from "../mongoose/schemas/user.mjs";
import { Booking } from "../mongoose/schemas/booking.mjs";
import passport from "passport"
import "../strategies/jwt-strategy.mjs"

const router = Router()

// allow user to set a default location for booking appointments
router.post("/api/settings/setdefaultlocation", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const googlePlacesID = req.body.googlePlacesID
        const additionalDetails = req.body.additionalDetails

        user.defaultLocation = {
            googlePlacesID: googlePlacesID,
            additionalDetails: additionalDetails
        }
        user.save()
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

// allow user to clear any set default location for booking appointments
router.post("/api/settings/cleardefaultlocation", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        user.defaultLocation = {}
        user.save()
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.get("/api/settings/defaultlocation", passport.authenticate('jwt', { session: false }), async (req, res) => {
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
})

// returning an overview of the user's profile info
router.get("/api/settings/overviewprofileinfo", passport.authenticate('jwt', { session: false }), async (req, res) => {
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
})

export default router