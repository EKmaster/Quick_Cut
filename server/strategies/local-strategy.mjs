import password from "passport"
import {Strategy} from "passport-local"
import {customers} from "../mockUsers.mjs"
import { User } from "../mongoose/schemas/user.mjs";

password.serializeUser((user, done) => {
    console.log("Insde Serializer")
    console.log(user)
    done(null, user.id);

})

password.deserializeUser( async (id, done) => {
    console.log(`Inside Deserializer with ID: ${id}`);
    
    try {
        const findUser = await User.findById(id);

        if (!findUser) throw new Error("User not found")
        
        done(null, findUser)
    }
    catch (err) {
        done(err, null)

    }
})


export default password.use(
    new Strategy({usernameField: "email"}, async (email, password, done) => {
        console.log(email)
        console.log(password)
        try {
            const findUser = await User.findOne({ email });

            if (!findUser) throw new Error("User not found")
                if (findUser.password !== password)
                    throw new Error("Bad Credentials");
    
            
            done(null, findUser)
        }
        catch (err) {
            done(err, null)

        }

    })
)