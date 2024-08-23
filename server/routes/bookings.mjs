import {Router} from "express"
import userVerified from "../utils/middlewares.mjs";
import passport from "passport"
import { book } from "../handlers/bookings.mjs";

const router = Router()

// booking an appointment
router.post("/api/book", passport.authenticate('jwt', { session: false }), userVerified, book);

export default router
