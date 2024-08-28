import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "../mongoose/schemas/user.mjs";
import 'dotenv/config';
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;

export default passport.use(new Strategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENTID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENTSECRET,
    callbackURL: 'http://localhost:8080/api/auth/google/redirect',
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user exists in the regular user database
        let savedUser = await User.findOne({ email: profile.emails[0].value });

        // If the user does not exist in the regular user database, check the Google users database
        // If the user does not exist in either database, create a new user in the Google users database
        if (!savedUser) {
            const newUser = new User({
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName || ' ',
                authMethod: "google",
                verified: true
            });
            savedUser = await newUser.save();
        }

        return done(null, {savedUser});
    } catch (err) {
        return done(err, false);
    }
}));
