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
        jwt.verify(jwt_payload, JWT_SECRET, async (err, decoded) => {
            if (err){
                throw new Error("Bad Credentials")
            }
            const user = await User.findById(decoded.id);
            if (user) {
                return done(null, user.id);
            } else {
                throw new Error("Bad Credentials")
            }
        })
    } catch (err) {
        return done(err, false);
    }
}));

export default passport
