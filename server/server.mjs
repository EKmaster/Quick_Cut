import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import bodyParser from 'body-parser';
import session from "express-session";
import passport from "passport";
import {customers} from "./mockUsers.mjs"
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { User } from "./mongoose/schemas/user.mjs";

const PORT = 8080;
const app = express();
mongoose.connect("mongodb+srv://omerkhan5002:3Nz0bihPwrbkcgps@cluster0.sd9uxwv.mongodb.net").then(()=> console.log("Connected to Database")).catch((err) => console.log(`Error: ${err}`));
//3Nz0bihPwrbkcgps
app.use(cors({
    origin: 'http://localhost:3000', // Update this to your frontend's URL
    credentials: true,
  }));
  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: "hello world",
    saveUninitialized: false,
    resave: false,
    cookie : {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}));

app.use(passport.initialize());
app.use(passport.session());
var bookings = [
]

app.get("/", (req, res) => {
    console.log(req.session)
    console.log(req.session.id)
    req.session.visited = true
    
    res.status(201).send({"message": bookings})
});
app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    
    res.sendStatus(200);
})

app.get("/api/auth/status", (req, res) => {
    req.session.visited = true
    console.log("Session ID:", req.session.id); // Check if session ID is present
  console.log("User:", req.user); // Check if user is defined
  console.log("Session:", req.session); // Check session data

    if (req.user) return res.sendStatus(200);
    console.log("yesss")
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
    const {body} = req;
    const newUser = new User(body)
    try {
        const savedUser = await newUser.save()
        const data = {
            email: req.body.email, password: req.body.password, firstName: req.body.firstName, lastName: req.body.lastName
        }
    
        req.login(savedUser, function(err) {
            if (err){
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
app.post("/api/book", (req, res) => {
    const name = req.body.name
    const city = req.body.city
    const haircut = req.body.haircut
    const timing = req.body.timing
    const data = {
        "name" : name,
        "city" : city,
        "timing" : timing,
        "haircut" : haircut
    }
    bookings.push(data)
    res.send(`Booking completed for ${name}`)
});


app.get("/api/bookings", (req, res) => {
    res.json(bookings)
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});