import {Router} from "express"
import { Booking } from "../mongoose/schemas/booking.mjs";
import passport from "passport"

const router = Router()

// booking an appointment
router.post("/api/book", passport.authenticate('jwt', { session: false }), async (req, res) => {
    console.log(data)
    const data = {
        "bookerID": req.user.id,
        "haircutDetails": req.body.haircutDetails,
        "timing": new Date(req.body.timing),
        "locationGooglePlacesID": req.body.locationGooglePlacesID,
        "locationDetails": req.body.locationDetails
    }
    const newBooking = new Booking(data)
    try {
        await newBooking.save()
        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(400)
    }

});

export default router
