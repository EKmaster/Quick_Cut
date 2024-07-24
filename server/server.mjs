import express from "express";
const app = express();
import cors from "cors";
import bodyParser from 'body-parser';
const PORT = 8080;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var bookings = [
]
var customers =[

]
app.get("/api", (req, res) => {
    res.json({"message": bookings})
});

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


app.post("/api/login/customer", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const data = {
        "email" : email,
        "password" : password
    }
    for (let item in customers) {
            if ((customers[item].email === email) && (customers[item].password === password)) {
                console.log("Logged In!")
            res.status(200).json({ success: true })
            return;  // Exit the function after sending a response

        }
    }

    console.log("Incorrect email or password!")
    res.status(404).json({ success: false, message: 'Incorrect email or password' });
    
});
app.post("/api/signup/customer", (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const data = {
        "email" : email,
        "password" : password
    }
    for (let item in customers) {
        if (customers[item].email == email) {
            console.log("Person already exists")
            res.status(404).json({ success: false, message: 'Exists' });
            return;  // Exit the function after sending a response
        }
    }
    customers.push(data)
    console.log("Signed up!")
    res.status(200).json({ success: true })
});
app.get("/api/bookings", (req, res) => {
    res.json(bookings)
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});