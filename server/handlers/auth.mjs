import bcrypt from "bcrypt"
import { User } from "../mongoose/schemas/user.mjs";
import { createJWT } from "../utils/createJWT.mjs"
import nodemailer from 'nodemailer'

export const signup = async (req, res) => {


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
}

export const sendVerificationCode = async (req, res) => {
    // check if valid verification code already exists in DB, if not, send new code to email
    const isForReset = req.query.purpose === 'reset';

    let user;

    try {
        if (req.query.purpose === 'reset') {
            user = await User.findOne({ email: req.query.email })
        }
        else {
            user = await User.findById(req.user.id)
        }
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
}

export const verifyEmail = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
        if (user.authMethod === "google") {
            // Redirect to Google Sign-In
            return res.status(400).send("Can not change password Google account.");

        }
        return res.sendStatus(200)

        // Continue with the standard password reset process...
    } else {
        return res.status(404).send("User not found.");
    }
}

export const status = (req, res) => {
    if (req.user) return res.sendStatus(200);
    return res.sendStatus(401);
}