import mongoose from "mongoose";

//change this to reflect bookings

const BookingSchema = new mongoose.Schema({
	bookerID: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    haircutDetails: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    timing: {
		type: mongoose.Schema.Types.Date,
		required: true,
	},
    locationGooglePlacesID: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    locationDetails: {
		type: mongoose.Schema.Types.String,
		required: true,
	},

});

export const Booking = mongoose.model("Booking", BookingSchema);