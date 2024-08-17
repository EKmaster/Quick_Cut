import {Router} from "express"
import { Booking } from "../mongoose/schemas/booking.mjs";
import userVerified from "../utils/middlewares.mjs";
import passport from "passport"

const router = Router()

// booking an appointment
router.post("/api/book", passport.authenticate('jwt', { session: false }), async (req, res) => {
    
    const data = {
        "bookerID": req.user.id,
        "service": req.body.service,
        "beard": req.body.beard,
        "haircutDetails": req.body.haircutDetails,
        "timing": new Date(req.body.timing),
        "locationGooglePlacesID": req.body.locationGooglePlacesID,
        "locationDetails": req.body.locationDetails
    }
    let price = 20
    if (data["beard"]) {
        price += 15
    }
    if (data["service"] === 'haircut') {
        price += 20
    }
    else if (data["service"] === 'buzz') {
        price += 15
    }
    else if (data["service"] === 'fade') {
        price += 25
    }
    else if (data["service"] === 'shave') {
        price += 7
    }
    else {
        return res.sendStatus(400)
    }
    data['price'] = price
    const newBooking = new Booking(data)
    try {
        await newBooking.save()
        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(400)
    }

});

export default router
