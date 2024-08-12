import { Router } from "express"
import bcrypt from "bcrypt"
import { User } from "../mongoose/schemas/user.mjs";
import passport from "passport"
import "../strategies/jwt-strategy.mjs"
import "../strategies/google-strategy.mjs"
import jwt from "jsonwebtoken"
import nodemailer from 'nodemailer'

const router = Router()
const JWT_SECRET = 'CCUTM5002'; // Use a strong secret key


const emailTransporter = nodemailer.createTransport({
    service: 'proton',
    auth: {
        user: 'cuick-cut@proton.me',
        pass: 'ducnah-mazdY8-byprox'
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
router.post("/api/auth/signup", async (req, res) => {
    const email = req.body.email;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const { body } = req;
        const password = body.password
        if (!password) {
            return res.status(400).json({ message: 'No password given' })
        }
        const salt = bcrypt.genSaltSync(10)

        body.password = bcrypt.hashSync(password, salt)
        body.authMethod = "local"
        body.verified = false
        body.verifcationCode = {}

        const newUser = new User(body)
        const savedUser = await newUser.save()

        createJWT(savedUser, res)
        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(400)
    }
})


// logging in 
router.post("/api/auth/login", async (req, res) => {
    // implement frontend logic to ensure neither email nor password field is empty before this route is used

    try {
        const email = req.body.email
        const password = req.body.password
        const findUser = await User.findOne({ email })
        if (!findUser) throw new Error("User not found")
        if (!bcrypt.compareSync(password, findUser.password)) {
            throw new Error("Bad Credentials")
        }
        createJWT(findUser, res)
        return res.sendStatus(200)
    }
    catch (err) {
        res.sendStatus(401)
    }
})


// verifying email (for non-google accounts)
router.get("/api/auth/sendverificationcode", passport.authenticate('jwt', { session: false }), async (req, res) => {
    // check if valid verification code already exists in DB, if not, send new code to email
    try {
        const user = await User.findById(req.user.id)
        const currentTime = new Date()

        // checking if a verificaiton code already exists in the database
        const { code, expiryTime } = user.verificationCode || {}
        if (code) {
            // checking if existing verification code was sent less than 2 minutes ago
            if ((expiryTime - currentTime) / (1000 * 60) > 8) {
                const secondsUntilNewCodeSend = ((expiryTime - currentTime) / 1000) - 480
                res.status(200)
                return res.json({ secondsUntilNewCodeSend: Math.round(secondsUntilNewCodeSend) })
            }
        }

        // creating new verification code
        const newCode = Math.floor(100000 + Math.random() * 900000)

        // setting new verification code in database
        user.verificationCode = { code: newCode, expiryTime: new Date(currentTime.getTime() + (10 * 60 * 1000)) }
        user.save()

        // sending email to user
        const mailOptions = {
            from: 'cuick-cut@proton.me',
            to: user.email,
            subject: 'Cuick Cut Verification Code',
            text: 'Your verification code is ' + newCode + '. It will expire in 10 minutes.'
        }
        // UNCOMMENT THE FOLLOWING PART LATER WHEN WE HAVE EMAIL SERVICE GOINGS
        /*
        emailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error sending email")
                //throw new Error("Error sending email")
            }
        })*/

        // send response back to frontend with code 200 if email sucessfully sent
        res.status(200)
        return res.json({ secondsUntilNewCodeSend: 0 })
    } catch (err) {
        return res.sendStatus(500) //if there is some error other than the user requesting a new code right after one has already been sent
    }
})
router.post("/api/auth/submitverificationcode", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
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
        res.sendStatus(500) // some error not handled in try block
    }
})


// getting authentication status (either logged in or not)
router.get("/api/auth/status", passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) return res.sendStatus(200);
    return res.sendStatus(401);
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