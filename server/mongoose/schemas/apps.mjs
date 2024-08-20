import mongoose from "mongoose";



const AppSchema = new mongoose.Schema({
	userID: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    fullName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
	address: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
	number: {
		type: mongoose.Schema.Types.Number,
		required: true,
	},
    cardNumber: {
		type: mongoose.Schema.Types.Number,
		required: true,
	},
    expiry: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    id: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    resume: {
		type: mongoose.Schema.Types.String,
        required: true,
	},
	equipment: {
		type: mongoose.Schema.Types.String,
		required: true,
	},

});

export const App = mongoose.model("App", AppSchema);