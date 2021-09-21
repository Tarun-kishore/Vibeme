const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql');
const User = require('./user')

const Post = sequelize.define('Post',{
    owner:{
        type: DataTypes.INTEGER,
        references:{
            model:'Users',
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
    },
    creator:{
        type: DataTypes.STRING,
        defaultValue: 'Anonymous'
    }
},
{
    timestamps:true
})

Post.prototype.getPost = function(){
    const post = this
    post.dataValues.image = post.dataValues.image.toString('base64')
    return post.dataValues
}

Post.beforeSave(async(post,options)=>{
    const user =  await User.findOne({where:{id: post.owner}})
    
    post.creator = user.firstName +' '+ user.lastName
    

    console.log(post)
})



Post.sync()
module.exports = Post