const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Token = require('../models/tokens')

const auth = async (req,res,next)=>{
    try {
        if(!req.cookies.token)
            return res.redirect('/')

        const decoded = jwt.verify(req.cookies.token, process.env.SECRET)

        const token = await Token.findOne({where:{user : decoded._id, token: req.cookies.token}})

        if(!token)
            return res.redirect('/')

        const user = await User.findOne({where:{id: decoded._id}})

        if(!user){
            await token.destroy()
            res.redirect('/login')
        }

        req.user = user
        req.token = token
        next()
    } catch (e) {
        res.status(500),send(e)
    }
}

module.exports = auth