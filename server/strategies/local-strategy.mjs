import password from "passport"
import {Strategy} from "passport-local"
import {customers} from "../mockUsers.mjs"

password.serializeUser((user, done) => {
    console.log("Insde Serializer")
    console.log(user)
    done(null, user.id);

})

password.deserializeUser((id, done) => {
    console.log(`Inside Deserializer with ID: ${id}`);
    
    try {
        const findUser = customers.find((user) => user.id === id)
        if (!findUser) throw new Error("User not found")
        
        done(null, findUser)
    }
    catch (err) {
        done(err, null)

    }
})


export default password.use(
    new Strategy({usernameField: "email"}, (email, password, done) => {
        console.log(email)
        console.log(password)
        try {
            const findUser = customers.find((user) => user.email === email)
            if (!findUser) throw new Error("User not found")
            if (findUser.password !== password) throw new Error("Invalid Credentials")
            
            done(null, findUser)
        }
        catch (err) {
            done(err, null)

        }

    })
)