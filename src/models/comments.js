const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql')
const Reply = require('./replies')
const User = require('./user')

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

Comment.prototype.getCommentData = async function(){
    let comment = this.toJSON()
    comment.repliesCount = 0
    const replies = await Reply.count({where:{repliedOn : comment.id}})
    comment.repliesCount = replies

    return comment
}

Comment.beforeDestroy( async(comment,options)=>{
    const repliess = await Reply.findAll({where:{repliedOn:comment.id}})

    replies.forEach(async(reply)=>{
        await reply.destroy()
    })
})

Comment.sync()

module.exports = Comment