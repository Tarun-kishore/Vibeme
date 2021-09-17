const express = require('express')
const router = express.Router()



router.get('/login',(req,res)=>{
    if(req.cookies.token)
        return res.redirect('/')
        
    res.render('login')
})

router.get('/signup',(req,res)=>{
    if(req.cookies.token)
        return res.redirect('/')

    res.render('signup',)
})


router.get('/',(req,res)=>{
    const options={}
    if(req.cookies.token)
        options.loggedIn = true

    res.render('index',options)
})


module.exports = router