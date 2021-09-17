const express = require('express')
const { appendFile } = require('fs')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middlewares/auth')
const Token = require('../models/tokens')

router.post('/login',async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body)
        // console.log(user.getPublicProfile())
        // console.log(user)
        const token = await user.generateAuthToken()

        return res
        .cookie("token", token, {
            maxAge: 90786787,
            httpOnly: true
        })
        .redirect('/')
        
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.post('/signup',async (req,res)=>{
    delete req.body.confirmPassword
    req.body.firstName = req.body.firstName.trim()
    req.body.lastName = req.body.lastName.trim()
    req.body.email = req.body.email.trim()
    req.body.email = req.body.email.toLowerCase()
    
    const user = User.build(req.body)
    
    try {
        await user.save()

        const token = await user.generateAuthToken()

        return res
        .cookie("token", token, {
            maxAge: 30*24*60*60*1000,
            httpOnly: true
        })
        .redirect('/')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/logout',auth,async (req,res)=>{
    try {
        await req.token.destroy()

        res
        .clearCookie('token')
        .redirect('/')
    } catch (e) {
        res.status(500).send(e)
    }

})

router.post('/exist',async (req,res)=>{
    try {
        req.body.email = req.body.email.trim()
        req.body.email = req.body.email.toLowerCase()
        const user = await User.findOne({where: req.body})
        
        if(user)
            return res.status(200).send({exist:true})
        res.status(404).send({exist:false})
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router