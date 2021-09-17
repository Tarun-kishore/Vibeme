const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const { nextTick } = require('process');
const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql');
const Token = require('./tokens')

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

User.prototype.getPublicProfile = function(){
  const user = this
  const userObject = user.dataValues

  delete userObject.password
  return userObject
}

User.prototype.generateAuthToken = async function(){
  const user =this
  const token = await jwt.sign({_id: user.id},process.env.SECRET)

  const tokenData = Token.build({user: user.id, token})

  await tokenData.save()

  return token
}

User.beforeSave( async(user, options)=>{
  if(user.changed('password')){
    user.password = await bcrypt.hash(user.password,8)
  }

})

User.sync()

module.exports = User