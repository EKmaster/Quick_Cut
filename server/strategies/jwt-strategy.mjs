import passport from "passport"
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from "../mongoose/schemas/user.mjs"
import jwt from "jsonwebtoken";

const JWT_SECRET = 'CCUTM5002'; // Use a strong secret key
const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.token]),
    secretOrKey: JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        
        // jwt_payload contains the decoded token payload
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user); // Pass the user object to `req.user`
        } else {
            
            return done(null, false); // No user found, authentication failed
        }
    } catch (err) {
        
        return done(err, false); // Pass error to `done`
    }
}));


export default passport
