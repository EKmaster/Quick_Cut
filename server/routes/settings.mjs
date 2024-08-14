import { Router } from "express"
import { User } from "../mongoose/schemas/user.mjs";
import passport from "passport"
import "../strategies/jwt-strategy.mjs"

const router = Router()

// allow user to set a default location for booking appointments
router.post("/api/settings/setdefaultlocation", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        const googlePlacesID = req.body.googlePlacesID
        const additionalDetails = req.body.additionalDetails

        user.defaultLocation = {
            googlePlacesID: googlePlacesID,
            additionalDetails: additionalDetails
        }
        user.save()
        res.sendStatus(200)
    } catch (err){
        res.sendStatus(500)
    }
})

// allow user to clear any set default location for booking appointments
router.post("/api/settings/setdefaultlocation", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        user.defaultLocation = {}
        user.save()
        res.sendStatus(200)
    } catch (err){
        res.sendStatus(500)
    }
})

export default router