import jwt from 'jsonwebtoken'

export default async function Auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decodedToken

        // res.json(decodedToken);
        next();

    } catch (error) {
        res.status(401).send({ error: "Authentication failed!" });
    }
}

export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
} 