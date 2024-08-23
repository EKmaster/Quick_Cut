import { Router } from "express"
import bcrypt from "bcrypt"
import { User } from "../mongoose/schemas/user.mjs";

import passport from "passport"
import "../strategies/jwt-strategy.mjs"
import "../strategies/google-strategy.mjs"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'

import {login, sendVerificationCode, signup, status, verifyEmail} from "../handlers/auth.mjs"

const router = Router()
const JWT_SECRET = 'CCUTM5002'; // Use a strong secret key


const emailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: ''
    }
});

const createJWT = (user, res) => {
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    })
}

// signing up
router.post("/api/auth/signup", signup)

// logging in 
router.post("/api/auth/login", login)
// Custom middleware to conditionally apply authentication
const conditionalAuth = (req, res, next) => {
    const isForReset = req.query.purpose === 'reset';
    if (isForReset) {
        return next(); // Skip authentication
    }
    passport.authenticate('jwt', { session: false })(req, res, next); // Apply authentication
};

// verifying email (for non-google accounts)
router.get("/api/auth/sendverificationcode", conditionalAuth, sendVerificationCode)

router.post("/api/auth/submitverificationcode", conditionalAuth, async (req, res) => {
    

    let user;

    try {
        if (req.query.purpose === 'reset') {
            user = await User.findOne({ email: req.query.email })

        }
        else {
            user = await User.findById(req.user.id)
        }
        const currentTime = new Date()

        // checking if a verificaiton code is valid
        const { code, expiryTime } = user.verificationCode || {}
        if (code) {
            if (currentTime < expiryTime) {
                // if code is correct, verify user
                if (req.body.submittedCode == code) {

                    user.verified = true
                    user.verificationCode = {}
                    user.save()


                    res.status(200)
                    res.json({ verified: true });
                }
                // if code is incorrect do not verify user
                else {
                    res.json({ verified: false })
                    res.status(200)
                }
            }
        }
        // no valid code currently exists
        res.status(404)
    } catch (err) {
        console.log(err)
        res.sendStatus(500) // some error not handled in try block
    }
})

// handling forgotten passwords
router.post('/api/auth/verifyemail', verifyEmail);

router.post('/api/auth/forgot-password', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    const password = req.body.password
    console.log(user.email)
    if (user) {

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update the user's password
        user.password = hashedPassword;
        // Save the updated user document
        await user.save();
        return res.sendStatus(200)
    } else {
        return res.status(404).send("User not found.");
    }
});

// getting authorization statuses (logged in, verified)
router.get("/api/auth/status", passport.authenticate('jwt', { session: false }), status)

router.get("/api/auth/verified", passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (user.verified) {
            return res.sendStatus(200)
        }
        return res.sendStatus(401)
    } catch (err) {
        return res.sendStatus(500)
    }
})

// logging out
router.post("/api/auth/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
    res.sendStatus(200)
})


// authentication with google
router.get('/api/auth/google', passport.authenticate('google'));
router.get('/api/auth/google/redirect', passport.authenticate('google', { session: false }), async (req, res) => {
    // Redirect or respond with the JWT toke
    try {
        const email = req.user.savedUser.email
        const findUser = await User.findOne({ email })
        if (!findUser) throw new Error("User not found")

        createJWT(findUser, res)
        res.redirect(`http://localhost:3000`);
    }
    catch (err) {
        res.sendStatus(401)
    }

});


  

  
export default router;