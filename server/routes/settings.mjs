import { Router } from "express"
import { User } from "../mongoose/schemas/user.mjs";
import { Booking } from "../mongoose/schemas/booking.mjs";
import passport from "passport"
import "../strategies/jwt-strategy.mjs"
import { cleardefaultlocation, defaultlocation, overviewProfileInfo, setdefaultlocation } from "../handlers/settings.mjs";

const router = Router()

// allow user to set a default location for booking appointments
router.post("/api/settings/setdefaultlocation", passport.authenticate('jwt', { session: false }), setdefaultlocation)

// allow user to clear any set default location for booking appointments
router.post("/api/settings/cleardefaultlocation", passport.authenticate('jwt', { session: false }), cleardefaultlocation)

router.get("/api/settings/defaultlocation", passport.authenticate('jwt', { session: false }), defaultlocation)

// returning an overview of the user's profile info
router.get("/api/settings/overviewprofileinfo", passport.authenticate('jwt', { session: false }), overviewProfileInfo)

export default router