import { Router } from "express"
import { User } from "../mongoose/schemas/user.mjs";
import { Booking } from "../mongoose/schemas/booking.mjs";
import passport from "passport"
import "../strategies/jwt-strategy.mjs"
import { overviewProfileInfo } from "../handlers/settings.mjs";

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
router.get("/api/settings/overviewprofileinfo", passport.authenticate('jwt', { session: false }), overviewProfileInfo)

export default router