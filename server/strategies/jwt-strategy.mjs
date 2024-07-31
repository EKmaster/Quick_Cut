import passport from "passport"
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from "../mongoose/schemas/user.mjs";

const JWT_SECRET = 'CCUTM5002'; // Use a strong secret key
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

export default passport
