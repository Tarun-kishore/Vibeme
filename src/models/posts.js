const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql');
const Likes = require('./likes')
const Comment = require('./comments')

const Post = sequelize.define('Post',{
    owner:{
        type: DataTypes.INTEGER,
        references:{
            model:'User',
            key:'id'
        }
    },
    image:{
        type: DataTypes.BLOB('long'),
        allowNull:false,
    },
    content:{
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    timestamps:true
})

Post.prototype.getPost =async function(){
    const post = this.toJSON()
    post.image = post.image.toString('base64')
    post.likesCount = await Likes.count({where:{likedPost:post.id}})
    post.commentCount = await Comment.getCount(post.id)
    return post
}

Post.prototype.getComments = async function(userId){
    const post = this.toJSON()

    const comments = await Comment.findAll({where: {commentedOn : post.id}})

    let options = []
    for(let i=0;i<comments.length;i++){
        const commentData =await comments[i].getCommentData()
        if(userId === commentData.commentedBy)
            commentData.isMine = true
        else 
            commentData.isMine = false
        options = options.concat(commentData)
    }
    return options
}

Post.beforeDestroy(async(post,options)=>{
    const likes = await Likes.findAll({where:{likedPost: post.id}})

    likes.forEach(async(like)=>{
        await like.destroy();
    })

    const comments = await Comment.findAll({where:{commentedOn: post.id}})

    comments.forEach(async(comment)=>{
        await comment.destroy()
    })
})



Post.sync()
module.exports = Post