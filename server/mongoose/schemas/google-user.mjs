import mongoose from "mongoose";

const GoogleUserSchema = new mongoose.Schema({
	email: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
    firstName: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    lastName: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
});

export const GoogleUser = mongoose.model("Google", GoogleUserSchema);