import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator';

/** Middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method === 'GET' ? req.query : req.body;

        if (!username) {
            return res.status(400).send({ error: "Username is required" });
        }

        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Attach the user object to the request for later use if needed
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in verifyUser middleware:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
}


/** POST http://localhost:8080/api/register */
export async function register(req, res) {
    try {
        const { username, password, email, profile } = req.body;

        const existUserName = await UserModel.findOne({ username });
        if (existUserName) {
            return res.status(400).json({ error: "Please use a unique username" });
        }
        const existEmail = await UserModel.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ error: "Please use a unique email" });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email
            });

            await user.save();

            return res.status(201).json({ msg: "User registered successfully" });
        } else {
            return res.status(400).json({ error: "Password is required" });
        }
    } catch (error) {
        console.log("Error in registration:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


/** POST http://localhost:8080/api/login */
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        UserModel.findOne({ username })
            .then((user) => {
                bcrypt.compare(password, user.password)
                    .then((passwordCheck) => {
                        if (!passwordCheck) {
                            res.status(400).send({ error });
                        }

                        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" })

                        return res.status(200).send({
                            msg: "Login Successfully..!",
                            username: user.username,
                            token
                        })
                    })
                    .catch((error) => {
                        return res.status(400).send({ error });
                    })
            })
            .catch((error) => {
                return res.status(404).send({ error })
            })
    } catch (error) {
        return res.status(500).send({ error });
    }
}

/** GET http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) return res.status(501).send({ error: "Invalid UserName" });

        const user = await UserModel.findOne({ username });

        if (!user) return res.status(501).send({ error: "Couldn't find the user" });

        /** remove password from user */
        /** mongoose return unnecessary data with object so convert it into json */

        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(201).send(rest);
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


/** PUT http://localhost:8080/api/updateUser */
export async function updateUser(req, res) {
    try {
        // const id = req.query.id;
        const { userId } = req.user;

        if (!userId) {
            return res.status(400).send({ error: "User ID is required." });
        }

        const body = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, body, { new: true });

        if (!updatedUser) {
            return res.status(404).send({ error: "User not found." });
        }

        return res.status(200).send({ message: "User record updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).send({ error: "Internal server error." });
    }
}

/** GET http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })
}

/** GET http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the otp value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ Msg: "Verified successfully!" })
    }
    return res.status(400).send({ error: "Invalid OTP" });
}

// successfully redirect user when OTP is valid
/** GET http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {

    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession });
    }
    return res.status(440).send({ error: "Session exprired!" });
}

// Update the password when we have valid session
/** PUT http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) {
            return res.status(440).send({ error: "Session expired!" });
        }

        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

        req.app.locals.resetSession = false;
        return res.status(201).send({ msg: "Password updated successfully" });
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
}
