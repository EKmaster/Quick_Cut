import bcrypt from "bcryptjs"
import { User } from "../mongoose/schemas/user.mjs";
import { createJWT } from "../utils/createJWT.mjs"
import nodemailer from 'nodemailer'
import passport from "passport"

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
    try {
        const isForReset = req.query.purpose === 'reset';
        let user;
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
        await user.save()

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

//  checks if the email entered by a user in the forgot password page is associated with a locally authenticated account
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

export const login = async (req, res) => {
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
}

export const submitverificationcode = async (req, res) => {
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
                    await user.save()


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
        //console.log(err)
        res.sendStatus(500) // some error not handled in try block
    }
}

export const conditionalAuth = (req, res, next) => {
    const isForReset = req.query.purpose === 'reset';
    if (isForReset) {
        return next(); // Skip authentication
    }
    passport.authenticate('jwt', { session: false })(req, res, next); // Apply authentication
};

export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const password = req.body.password

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
    } catch (err) {
        return res.sendStatus(500)
    }
}

export const verfied = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (user.verified) {
            return res.sendStatus(200)
        }
        return res.sendStatus(401)
    } catch (err) {
        return res.sendStatus(500)
    }
}

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: "strict"
    })
    res.sendStatus(200)
}

export const redirect = async (req, res) => {
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

}