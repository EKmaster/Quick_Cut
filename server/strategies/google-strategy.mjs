import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "../mongoose/schemas/user.mjs";
import { GoogleUser } from "../mongoose/schemas/google-user.mjs";
import jwt from "jsonwebtoken"

const JWT_SECRET = 'CCUTM5002';
export default passport.use(new Strategy({
    clientID: '327353437075-t2nfjh45na7u1d0ikvo001mu5ms0k1dh.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8080/api/auth/google/redirect',
    scope: ["profile", "email"]
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user exists in the regular user database
    let savedUser = await User.findOne({ email: profile.emails[0].value });
    
    // If the user does not exist in the regular user database, check the Google users database
    if (!savedUser) {
      savedUser = await GoogleUser.findOne({ email: profile.emails[0].value });
      
      // If the user does not exist in either database, create a new user in the Google users database
      if (!savedUser) {
        const newUser = new GoogleUser({
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName
        });
        savedUser = await newUser.save();
      }
    }

      const payload = { id: savedUser.id, email: savedUser.email }
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      return done(null, { savedUser, token });
    } catch (err) {
      return done(err, false);
    }
  }));
  