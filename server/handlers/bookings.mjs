import { Booking } from "../mongoose/schemas/booking.mjs";

export const book = async (req, res) => {
    try {
        const data = {
            "bookerID": req.user.id,
            "service": req.body.service,
            "beard": req.body.beard,
            "haircutDetails": req.body.haircutDetails,
            "timing": new Date(req.body.timing),
            "locationGooglePlacesID": req.body.locationGooglePlacesID,
            "locationDetails": req.body.locationDetails,
            status: "pending"
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
        data['price'] = price
        const newBooking = new Booking(data)
        await newBooking.save()
        return res.sendStatus(200)
    } catch (err){
        res.status(400)
        return res.send("Invalid request data")
    }
}