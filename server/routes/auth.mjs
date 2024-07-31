import { Router } from "express"
import bcrypt from "bcrypt"
import { User } from "../mongoose/schemas/user.mjs";
import passport from "passport"
import "../strategies/jwt-strategy.mjs"
import jwt from "jsonwebtoken"

const router = Router()
const JWT_SECRET = 'CCUTM5002'; // Use a strong secret key

// signing up
router.post("/api/auth/signup", async (req, res) => {
    const { body } = req;
    const password = body.password
    const salt = bcrypt.genSaltSync(10)
    body.password = bcrypt.hashSync(password, salt)

    const newUser = new User(body)
    console.log(newUser)
    try {
        const savedUser = await newUser.save()
        console.log("test")
        const payload = { id: savedUser.id }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
        return res.status(200).json({ "token": token })
    } catch (err) {
        return res.sendStatus(400)
    }
})


// logging in 
router.post("/api/auth/login", async (req, res) => {
    // implement frontend logic to ensure neither email nor password field is empty before this route is used
    try {
        console.log(req.body)
        const email = req.body.email
        const password = req.body.password
        const findUser = await User.findOne({email})
        if (!findUser) throw new Error("User not found")
        if (!bcrypt.compareSync(password, findUser.password)) {
            console.log(bcrypt(findUser.password))
            throw new Error("Bad Credentials")
        }
        const payload = { id: findUser.id, email: findUser.email }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
        return res.status(200).json({ "token": token })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(401)
    }
})

// getting authentication status (either logged in or not)
router.get("/api/auth/status", passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user) return res.sendStatus(200);
    return res.sendStatus(401);
})

export default router;