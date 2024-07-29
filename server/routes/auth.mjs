import {Router} from "express"
import bcrypt from "bcrypt"
import { User } from "../mongoose/schemas/user.mjs";
import passport from "passport";

const router = Router()

// signing up
router.post("/api/auth/signup", async (req, res) => {
    const { body } = req;
    const password = body.password
    const salt = bcrypt.genSaltSync(10)
    body.password = bcrypt.hashSync(password, salt)

    const newUser = new User(body)

    try {
        const savedUser = await newUser.save()
        req.login(savedUser, function (err) {
            if (err) {
                console.log(err)
                return res.status(201).send(savedUser)
            }
            res.sendStatus(200);

        })

    } catch (err) {
        console.log(err)
        return res.sendStatus(400)
    }
})

// logging in 
router.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
})

// getting authentication status (either logged in or not)
router.get("/api/auth/status", (req, res) => {
    if (req.user) return res.sendStatus(200);
    return res.sendStatus(401);
})

// logging out
router.post("/api/auth/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.sendStatus(200);
    })
})

export default router;