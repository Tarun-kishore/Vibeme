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



Post.sync()
module.exports = Post