import jwt from "jsonwebtoken"

import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET;

export const createJWT = (user, res) => {
    const payload = { id: user.id }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    })
}