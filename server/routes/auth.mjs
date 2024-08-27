import { Router } from "express"
import bcrypt from "bcrypt"
import { User } from "../mongoose/schemas/user.mjs";

import passport from "passport"
import "../strategies/jwt-strategy.mjs"
import "../strategies/google-strategy.mjs"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'

import {login, sendVerificationCode, submitverificationcode, signup, status, verifyEmail, conditionalAuth, forgotPassword, verfied, logout, redirect} from "../handlers/auth.mjs"

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

// verifying email (for non-google accounts)
router.get("/api/auth/sendverificationcode", conditionalAuth, sendVerificationCode)

router.post("/api/auth/submitverificationcode", conditionalAuth, submitverificationcode)

// handling forgotten passwords
router.post('/api/auth/verifyemail', verifyEmail);

router.post('/api/auth/forgot-password', forgotPassword );

// getting authorization statuses (logged in, verified)
router.get("/api/auth/status", passport.authenticate('jwt', { session: false }), status)

router.get("/api/auth/verified", passport.authenticate('jwt', { session: false }), verfied)

// logging out
router.post("/api/auth/logout", passport.authenticate("jwt", { session: false }), logout)


// authentication with google
router.get('/api/auth/google', passport.authenticate('google'));
router.get('/api/auth/google/redirect', passport.authenticate('google', { session: false }), redirect);


  

  
export default router;