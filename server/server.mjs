import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import bodyParser from 'body-parser';
import session from "express-session";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { User } from "./mongoose/schemas/user.mjs";
import { Booking } from "./mongoose/schemas/booking.mjs";
import bcrypt from "bcrypt"

const PORT = 8080;
const app = express();
mongoose.connect("mongodb+srv://omerkhan5002:3Nz0bihPwrbkcgps@cluster0.sd9uxwv.mongodb.net").then(() => console.log("Connected to Database")).catch((err) => console.log(`Error: ${err}`));



app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: "hello world",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// middleware to verify authentication status
const verifyAuth = (req, res, next) => {
    console.log("test ")
    if (req.isAuthenticated()){
        console.log("is authenticated")
        return next()
    }else{
        console.log("is not authenticated")
        return res.sendStatus(401)
    }
}


app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
})

app.get("/api/auth/status", (req, res) => {
    console.log("Session ID:", req.session.id); // Check if session ID is present
    console.log("User:", req.user); // Check if user is defined
    console.log("Session:", req.session); // Check session data

    if (req.user) return res.sendStatus(200);
    return res.sendStatus(401);
})

app.post("/api/auth/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.sendStatus(200);
    })
})

app.post("/api/auth/signup", async (req, res) => {
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

app.post("/api/book", verifyAuth, async (req, res) => {
    const data = {
        "bookerID": req.user.id,
        "city": req.body.city,
        "timing": req.body.timing,
        "haircutDetails": req.body.haircutDetails
    }
    console.log(data)
    const newBooking = new Booking(data)
    try {
        await newBooking.save()
        return res.sendStatus(200)
    } catch (err) {
        return res.sendStatus(400)
    }

});


app.get("/api/bookings", (req, res) => {
    res.json(bookings)
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});