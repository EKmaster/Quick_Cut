import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import bodyParser from 'body-parser';
import session from "express-session";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import MongoStore from "connect-mongo";
import { Booking } from "./mongoose/schemas/booking.mjs";
import mongoose from "mongoose"
import authRouter from "./routes/auth.mjs"
import bookingsRouter from "./routes/bookings.mjs"
import verifyAuth from "./utils/middlewares.mjs";

const PORT = 8080;
const app = express();

mongoose.connect("mongodb+srv://omerkhan5002:3Nz0bihPwrbkcgps@cluster0.sd9uxwv.mongodb.net").then(() => console.log("Connected to Database")).catch((err) => console.log(`Error: ${err}`));

// adding middlewares
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

// registering routes
app.use(authRouter)
app.use(bookingsRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});