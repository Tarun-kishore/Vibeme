const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Comment = require('../models/comments')

router.post('/create/:postId',auth,async (req,res)=>{
    try {
        const comment = Comment.build({commentedOn : req.params.postId, commentedBy: req.user.id, comment: req.body.comment,poster: req.user.getFullName()})

        await comment.save()

        res.redirect(`/post/view/${req.params.postId}`)
    } catch (e) {
        console.error(e)
        res.send(e)
    }
})


module.exports=router