import jwt from "jsonwebtoken"

const JWT_SECRET = 'CCUTM5002'; // Use a strong secret key

export const createJWT = (user, res) => {
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    })
}