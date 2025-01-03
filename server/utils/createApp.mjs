
import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import bodyParser from 'body-parser';
import session from "express-session";
import passport from "passport";
import '../strategies/jwt-strategy.mjs'
import mongoose from "mongoose"
import authRouter from '../routes/auth.mjs'
import bookingsRouter from "../routes/bookings.mjs"
import settingsRouter from "../routes/settings.mjs"
import joinRouter from "../routes/join.mjs"
import csrf from 'csurf';

export function createApp() {
    const app = express();

    app.use(cors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        optionsSuccessStatus: 204,
        credentials: true,
    }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    const csrfProtection = csrf({ cookie: { httpOnly: false, secure: false, sameSite: 'Strict' } });
    app.use(csrfProtection);

    app.use(session({
        secret: "hello world",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
        // store: MongoStore.create({
        //     client: mongoose.connection.getClient()
        // })
    }));

    app.use(passport.initialize());

    app.get('/api/csrf-token', (req, res) => {
        res.status(200)
        res.json({ csrfToken: req.csrfToken() });
    });

    // registering routes
    app.use(authRouter)
    app.use(bookingsRouter)
    app.use(settingsRouter)
    app.use(joinRouter)
    return app;
}