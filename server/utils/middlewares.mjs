const verifyAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        return res.sendStatus(401)
    }
}

export default verifyAuth