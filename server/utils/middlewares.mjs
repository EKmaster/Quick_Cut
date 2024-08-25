import { User } from "../mongoose/schemas/user.mjs";

const userVerified = async (req, res, next) => {
    // if a user isn't logged in 
    if (!req.user){
        return res.sendStatus(401)
    }
    // checking if a logged in user is verified
    try{
        const user = await User.findById(req.user.id)
        if (!user.verified){
            return res.sendStatus(401)
        }
        next()
    } catch (err){
        console.log(err)
        return res.sendStatus(500)
    }
}

export default userVerified