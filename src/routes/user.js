const express = require('express')
const { appendFile } = require('fs')
const router = express.Router()
const User = require('../model/user')

router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/login',(req,res)=>{
    console.log(req.body)
    res.render('login')
})

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.post('/signup',async (req,res)=>{
    delete req.body.confirmPassword
    req.body.firstName = req.body.firstName.trim()
    req.body.lastName = req.body.lastName.trim()
    req.body.email = req.body.email.trim()
    req.body.email = req.body.email.toLowerCase()
    
    const user = User.build(req.body)

    res.render('signup')
})

module.exports = router