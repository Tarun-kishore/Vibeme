const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Post = require('../models/posts')
const User = require('../models/user')

router.get('/my',auth,async(req,res)=>{
    try {
        const posts = await Post.findAll({where:{owner:req.user.id}})
        
        
        let options = []
        let postData
        
        posts.forEach((post) => {
            postData =post.getPost()

            options = options.concat(postData)
        })
        
        res.render('myPosts.hbs',{loggedIn: true,posts:{...options}})    
    } catch (error) {
        res.status(500).send()
    } 
})

router.get('/create',auth,(req,res)=>{
    res.render('createPost',{loggedIn:true})
})

router.post('/create',auth,async (req,res)=>{
    try {
        const img= JSON.parse(req.body.image)
        const buffer = new Buffer.from(img.data, 'base64')

        const post = Post.build({owner: req.user.id, image: buffer, content: req.body.content})
        await post.save()
        
        res.redirect('/post/my')
    } catch (e) {
        res.status(400).render('createPost',{loggedIn:true,error:e})
    }

    
})

module.exports = router