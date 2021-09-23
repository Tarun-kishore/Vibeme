const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql');
const User = require('./user')
const Likes = require('./likes')

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
    return post
}

Post.beforeDestroy(async(post,options)=>{
    const likes = await Likes.findAll({where:{likedPost: post.id}})

    likes.forEach(async(like)=>{
        await like.destroy();
    })
})



Post.sync()
module.exports = Post