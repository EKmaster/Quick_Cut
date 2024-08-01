import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	email: {
		type: mongoose.Schema.Types.String,
		required: true,
		unique: true,
	},
	password: {
		type: mongoose.Schema.Types.String,
	},
    firstName: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    lastName: {
		type: mongoose.Schema.Types.String,
		required: true,
	},
    authMethod: { type: mongoose.Schema.Types.String, enum: ['local', 'google'], required: true },

});

export const User = mongoose.model("User", UserSchema);