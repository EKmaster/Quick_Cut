import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import bodyParser from 'body-parser';
import session from "express-session";
import passport from "passport";
import "./strategies/jwt-strategy.mjs";
import mongoose from "mongoose"
import authRouter from "./routes/auth.mjs"
import bookingsRouter from "./routes/bookings.mjs"
import settingsRouter from "./routes/settings.mjs"
import joinRouter from "./routes/join.mjs"
import csrf from 'csurf';
import 'dotenv/config';

import { createApp } from "./utils/createApp.mjs";
mongoose.connect(process.env.MONGODB_PRODUCTION).then(() => console.log("Connected to Database")).catch((err) => console.log(`Error: ${err}`));
const app = createApp()
const PORT = 8080;

// listening on port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`)
});

export default app