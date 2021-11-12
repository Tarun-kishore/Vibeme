// *This files contains the definition of schema of comment

// *importing database library and connection
const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql')

// * importing other models from files
const Reply = require('./replies')
const User = require('./user')
const Post = require('./posts')

// *Schema definition
const Comment =sequelize.define('Comment',{
    commentedOn :{
        type: DataTypes.INTEGER,
        references:{
            model:'Posts',
            key:'id'
        },
        allowNull:false
    },
    commentedBy:{
        type: DataTypes.INTEGER,
        references:{
            model:'Users',
            key:'id'
        },
        allowNull:false
    },
    comment:{
        type:DataTypes.STRING,
        allowNull:false
    },
    poster:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:true
})

// *Schema statics definitions
Comment.getCount =async function(postId){
    const comments = await Comment.findAll({where:{commentedOn:postId}})

    let count=0

    for(let i=0;i<comments.length;i++){
        count++
        const repliesCount = await Reply.count({where:{repliedOn : comments[i].id}})
        count +=repliesCount
    }
    
    return count
}

// *Comments methods definitions
Comment.prototype.getCommentData = async function(){
    let comment = this.toJSON()
    comment.repliesCount = 0
    const replies = await Reply.count({where:{repliedOn : comment.id}})
    comment.repliesCount = replies

    return comment
}

Comment.prototype.getCommentWithReplies = function(userId){
    let comment = this.toJSON()
    if(userId === comment.commentedBy){
        comment.isMine =  true
    }
    else comment.isMine = false
    const replies = comment.Replies

    comment.repliesCount = replies.length

    for(let i=0;i<replies.length;i++){
        replies[i]=replies[i]
        if(replies[i].repliedBy === userId){
            replies[i].isMine = true
        }
        else replies[i].isMine = false
    }

    comment.replies= replies


    return comment
}

// *defining the relationship between comment and reply model
Comment.hasMany(Reply,{
    foreignKey:'repliedOn',
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
})

Reply.belongsTo(Comment,{
    foreignKey:'repliedOn'
})

// *This line allows the server to automatically create database table if it does not exist already
Comment.sync()

module.exports = Comment