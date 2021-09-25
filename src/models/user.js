const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const { nextTick } = require('process');
const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql');
const Token = require('./tokens')
const Post = require('./posts')
const Like =require('./likes')
const Comment = require('./comments')
const Reply = require('./replies')

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim:true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    trim:true
  },
  email:{
    type: DataTypes.STRING,
    trim: true,
    allowNull:false,
    unique: true
    },
    password:{
        type:DataTypes.STRING,
        trim:true,
        allowNull:false
    },
}, {
  timestamps: true
});

User.findByCredentials = async function({email,password}){
  email = email.trim()
  email = email.toLowerCase()
  const user = await User.findOne({where:{email}}) 

  if(!user)
    throw new Error('Invalid Credentials')

  const isMatch = await bcrypt.compare(password,user.password)

  if(!isMatch)
    throw new Error('Invalid Credentials')

  return user
}

User.prototype.getFullName = function(){
  const user =this.toJSON()

  return `${user.firstName} ${user.lastName}`
}

User.prototype.getPublicProfile = function(){
  const userObject = this.toJSON()

  delete userObject.password
  return userObject
}

User.prototype.getPosts = async function(){
  const userObject = this.toJSON()

  const posts = await Post.findAll({where:{owner:userObject.id}})
        
  let options = []
  let postData
  
  for(let i=0;i<posts.length;i++){
    post=posts[i];
    postData =await post.getPost()

    options = options.concat({...postData, creator:`${userObject.firstName} ${userObject.lastName}`})
  }

  return options
}

User.prototype.getLikedPosts = async function(){
  const user = this.toJSON()

  const likedPost = await Like.findAll({where:{likedBy: user.id}})
      
  let options = []
  let postData


  for(let i=0;i<likedPost.length;i++){
    const post = await Post.findByPk(likedPost[i].likedPost)

    postData =await post.getPost()

    options = options.concat({...postData, creator:user.getFullName})
  }

  return options
}

User.prototype.generateAuthToken = async function(){
  const user =this
  const token = await jwt.sign({_id: user.id},process.env.SECRET)

  const tokenData = Token.build({user: user.id, token})

  await tokenData.save()
  
  return token
}

// User.beforeDestroy( async(user,options)=>{
//   try {
//     const tokens = await Token.findAll({where:{user: user.id}})
    
//     tokens.forEach(async (token) =>{
//         await token.destroy()
//       }  
//     )
    
//     const posts = await Post.findAll({where:{owner : user.id}})
    
//     posts.forEach(async(post)=>{
//       await post.destroy()
//     })
    
//     const likes = await Like.findAll({where:{likedBy: user.id}})
    
//     likes.forEach(async(like)=>{
//       await like.destroy()
//     })
    
//     const comments = await Comment.findAll({where:{commentedBy:user.id}})
    
//     comments.forEach(async(comment)=>{
//       await comment.destroy()
//     })
    
//     const replies = await Reply.findAll({where:{repliedBy: user.id}})
    
//     replies.forEach(async(reply)=>{
//       await reply.destroy()
//     })
    
//   } catch (e) {
//     throw new Error(e)
//   }

// })

User.beforeSave( async(user, options)=>{
  if(user.changed('password')){
    user.password = await bcrypt.hash(user.password,8)
  }

})

User.hasMany(Token,{
  foreignKey: 'user',
  onDelete:'CASCADE',
  onUpdate:'CASCADE'
})

User.hasMany(Post,{
  foreignKey: 'owner',
  onDelete:'CASCADE',
  onUpdate:'CASCADE'
})

User.hasMany(Like,{
  foreignKey: 'likedBy',
  onDelete:'CASCADE',
  onUpdate:'CASCADE'
})

Like.belongsTo(User,{
  foreignKey:'likedBy'
})


User.hasMany(Comment,{
  foreignKey: 'commentedBy',
  onDelete:'CASCADE',
  onUpdate:'CASCADE'
})

User.hasMany(Reply,{
  foreignKey: 'repliedBy',
  onDelete:'CASCADE',
  onUpdate:'CASCADE'
})

User.sync()


module.exports = User