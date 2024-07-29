// middleware function to ensure certain routes can only be accessed by users who are logged in
const verifyAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        return res.sendStatus(401)
    }
}

export default verifyAuth