const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId })
        if (loggedInUser) {
            return res.status(200).json({
                loggedIn: true,
                user: {
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    email: loggedInUser.email,
                    username: loggedInUser.username
                }
            })
        } else {
            return res
                .status(401)
                .json({
                    errorMessage: "No user found. Continue as a guest."
                })
        }
    })
}

loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res
            .status(400)
            .json({ errorMessage: "Please enter all required fields." })
    }
    let existingUser = await User.findOne({ email: email })
    if (!existingUser) {
        existingUser = await User.findOne({ username: email })
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    errorMessage: "No account found for this email."
                })
        }
    }
    bcrypt.compare(password, existingUser.passwordHash, async (error, match) => {
        if (error) {
            return res
                .status(400)
                .json({ errorMessage: "Unexpected error." })
        }
        if (match) {
            const token = auth.signToken(existingUser)

            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                loggedIn: true,
                user: {
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    email: existingUser.email,
                    username: existingUser.username
                }
            }).send()
        } else {
            return res
                .status(400)
                .json({ errorMessage: "Password is incorrect." })
        }
    })
}

logoutUser = async (req, res) => {
    return res
        .cookie("token", "none", {
            httpOnly: true,
            maxAge: new Date(1, 1)
        })
        .status(200)
        .send()
}

registerUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, passwordVerify } = req.body
        if (!username || !firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." })
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                })
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        // const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        } else {
            const oldUserName = await User.findOne({ username: username })
            if (oldUserName) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        errorMessage: "An account with this username already exists."
                    })
            }
        }

        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName, lastName, email, passwordHash, username
        })
        const savedUser = await newUser.save()

        // LOGIN THE USER
        const token = auth.signToken(savedUser)

        // await res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none"
        // }).status(200).json({
        //     success: true,
        //     user: {
        //         firstName: savedUser.firstName,
        //         lastName: savedUser.lastName,
        //         email: savedUser.email,
        //         username: savedUser.username,
        //     }
        // }).send()

        await res.status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                username: savedUser.username,
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).send()
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    logoutUser,
    loginUser,
}