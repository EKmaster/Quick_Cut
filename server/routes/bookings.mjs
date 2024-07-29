import {Router} from "express"
import { Booking } from "../mongoose/schemas/booking.mjs";
import verifyAuth from "../utils/middlewares.mjs";

const router = Router()

// booking an appointment
router.post("/api/book", verifyAuth, async (req, res) => {
    const data = {
        "bookerID": req.user.id,
        "city": req.body.city,
        "timing": req.body.timing,
        "haircutDetails": req.body.haircutDetails
    }
    console.log(data)
    const newBooking = new Booking(data)
    try {
        await newBooking.save()
        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(400)
    }

});

export default router
