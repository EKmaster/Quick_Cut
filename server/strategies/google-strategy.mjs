import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "../mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken"

const JWT_SECRET = 'CCUTM5002';

export default passport.use(new Strategy({
    clientID: '884046537126-o1p4aiur1v7r0jeafj8t2ceq9dug8ah9.apps.googleusercontent.com',
    clientSecret: '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',
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
                lastName: profile.name.familyName,
                authMethod: "google"
            });
            savedUser = await newUser.save();
        }

        //const payload = { id: savedUser.id, email: savedUser.email }
        //const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        return done(null, {savedUser});
    } catch (err) {
        return done(err, false);
    }
}));
