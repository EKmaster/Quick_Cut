import { Router } from "express"
import bcrypt from "bcrypt"
import { User } from "../mongoose/schemas/user.mjs";
import passport from "passport"
import "../strategies/jwt-strategy.mjs"
import "../strategies/google-strategy.mjs"
import jwt from "jsonwebtoken"

const router = Router()
const JWT_SECRET = 'CCUTM5002'; // Use a strong secret key

const createJWT = (user, res) => {
    const payload = { id: user.id}
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
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
        const newUser = new User(body)
        const savedUser = await newUser.save()

        createJWT(savedUser, res)
        return res.status(200)
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

// getting authentication status (either logged in or not)
router.get("/api/auth/status", passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) return res.sendStatus(200);
    return res.sendStatus(401);
})

// logging out
router.post("/api/auth/logout", passport.authenticate("jwt", {session: false}), (req, res) => {
    res.clearCookie("token",{
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
    res.sendStatus(200)
})

router.get('/api/auth/google/redirect', passport.authenticate('google', { session: false }), async (req, res) => {
    // Redirect or respond with the JWT toke
    try {
        const email = req.user.savedUser.email
        const findUser = await User.findOne({ email })
        if (!findUser) throw new Error("User not found")

        createJWT(findUser, res)
        res.redirect(`http://localhost:3000`);
        // return res.sendStatus(200)
    }
    catch (err) {
        res.sendStatus(401)
    }

});

router.get('/api/auth/google', passport.authenticate('google'));

export default router;