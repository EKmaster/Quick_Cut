import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    verified: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    },
    verificationCode: {
        code: { type: mongoose.Schema.Types.Number, required: false },
        expiryTime: { type: mongoose.Schema.Types.Date, required: false }
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
    },
    authMethod: { type: mongoose.Schema.Types.String, enum: ['local', 'google'], required: true },
    firstName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    lastName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    defaultLocation: {
        googlePlacesID: {type: mongoose.Schema.Types.String, required: false},
        additionalDetails: {type: mongoose.Schema.Types.String, required: false}
    }

});

export const User = mongoose.model("User", UserSchema);