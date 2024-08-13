import { User } from "../mongoose/schemas/user.mjs";

const userVerified = async (req, res, next) => {
    // if a user isn't logged in 
    if (!req.user){
        return res.statusCode(401)
    }
    // checking if a logged in user is verified
    try{
        const user = await user.findOne(req.user.id)
        if (!user.verified){
            return res.statusCode(401)
        }
        next()
    } catch (err){
        return res.statusCode(500)
    }
}

export default userVerified