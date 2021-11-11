// * This file handles the user authentication using HTTPonly cookies (they work just like sessions)

// *jsonwebtoken is a library which issues jwt tokens which are used for authentication.
const jwt = require('jsonwebtoken')

// *importing the database models 
const User = require('../models/user')
const Token = require('../models/tokens')

const auth = async (req, res, next) => {
    try {
        if (!req.cookies.token)
            return res.redirect('/login')

        // ! process.env.SECRET is a string stored in evironment which is used by jwt to authenticate tokens
        const decoded = jwt.verify(req.cookies.token, process.env.SECRET)

        const token = await Token.findOne({ where: { user: decoded._id, token: req.cookies.token } })

        if (!token)
            return res.redirect('/login')

        const user = await User.findOne({ where: { id: decoded._id } })

        if (!user) {
            await token.destroy()
            res.redirect('/login')
        }

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(500), send(e)
    }
}

module.exports = auth