const express = require('express')
const { appendFile } = require('fs')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middlewares/auth')
const Token = require('../models/tokens')
const bcrypt = require('bcrypt')

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

router.get('/profile',auth,(req,res)=>{
    try {
        res.render('profile',{loggedIn:true, ...req.user.getPublicProfile()})
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/delete',auth,async (req,res)=>{
    try {
        await req.user.destroy()
        res.clearCookie("token")
        .send('deleted')
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/update',auth,(req,res)=>{
    const data={loggedIn:true, ...req.user.getPublicProfile()}
    res.render('updateProfile',data)
})

router.put('/update',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    updates.forEach(update => req.user[update] = req.body[update])
    try {
        await req.user.save()
        res.send('done')
    } catch (e) {
        res.send(e)
    }
})


router.post('/change',auth,(req,res)=>{
    res.render('changePassword',{loggedIn:true})
})

router.put('/change',auth,async (req,res)=>{
    try {
        isMatch = await bcrypt.compare(req.body.oldPassword,req.user.password)
        console.log('done')
        if(!isMatch)
            return res.render('changePassword',{error: 'Wrong Old Password',loggedIn: true});
        req.user.password = req.body.password
        await req.user.save()
        res.send('done')
        
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router