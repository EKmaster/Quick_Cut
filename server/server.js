const express = require("express");
const app = express();
const cors = require("cors")
var bodyParser = require('body-parser');
const PORT = 8080;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var bookings = [
]

app.get("/", (req, res) => {
    res.json({"message": bookings})
});

app.post("/book", (req, res) => {
    
    console.log(req.body.name)
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

app.get("/bookings", (req, res) => {
    res.json(bookings)
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});