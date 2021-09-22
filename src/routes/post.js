const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Post = require('../models/posts')
const User = require('../models/user')


//getting all posts
router.get('/all',async(req,res)=>{
    const options={}
    if(req.cookies.token)
        options.loggedIn = true

    try {
        const users =await User.findAll({})

        
        let posts = []

        for (let index = 0; index < users.length; index++) {
            const userPosts = await users[index].getPosts()
            posts = posts.concat(userPosts)
            
        }
        
        res.render('feed',{...options,post:{...posts}})
        
    } catch (e) {
        console.log(e)
    }

})

//geting user posts
router.get('/my',auth,async(req,res)=>{
    try {
        const options =await req.user.getPosts()    

        res.render('myPosts.hbs',{loggedIn: true,posts:{...options}})    
    } catch (error) {
        res.status(500).send()
    } 
})

//rendering create post page
router.get('/create',auth,(req,res)=>{
    res.render('createPost',{loggedIn:true})
})


// Creating post by a user
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


// Viewing a post
router.get('/view/:id',async (req,res)=>{
    const options={}
    if(req.cookies.token)
        options.loggedIn = true

    try {
        const post = await Post.findByPk(req.params.id)
        const postObject = post.getPost()
    
        const user = await User.findByPk(postObject.owner)
        const creator = `${user.dataValues.firstName} ${user.dataValues.lastName}`
        res.render('publicPost',{...options,postData:{...postObject,creator}})
    } catch (e) {
        res.status(400).render('404',options)
    }

})


//rendering edit page
router.post('/edit/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findByPk(req.params.id)
        
        if(post.owner !== req.user.id){
            return res.render('notAuth',{loggedIn:true})
        }

        const creator = `${req.user.firstName} ${req.user.lastName}`
        res.render('editPost',{loggedIn:true,...post.getPost(),creator})
        
    } catch (e) {
        res.status(500).render('404',{loggedIn:true})
    }
})

//editing a post
router.put('/edit/:id',auth,async(req,res)=>{
    try {
        const post = await Post.findByPk(req.params.id)
    
        // console.log(post.content)
        if(post.owner !== req.user.id){
            return res.render('notAuth',{loggedIn:true})
        }
        // post=post.toJSON()
        // console.log(post)
        let changed=false;
        if(req.body.image){
            const img= JSON.parse(req.body.image)
            const buffer = new Buffer.from(img.data, 'base64')

            changed=true
            post.image = buffer
        }
        
        if(req.body.content){
            changed=true
            post.content = req.body.content
        }

        if(changed) await post.save()

        res.redirect('/post/my')

    } catch (e) {
        res.status(500).render('404',{loggedIn:true})
    }
})

// Deleting a post 
router.delete('/delete/:id',auth,async(req,res)=>{
    
    try {
        const post = await Post.findByPk(req.params.id)
    
        if(post.owner !== req.user.id){
            return res.render('notAuth',{loggedIn:true})
        }

        await post.destroy()

        res.redirect('/post/my')
        
    } catch (e) {
        res.status(500).render('404',{loggedIn:true})
    }

})



module.exports = router