const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const { nextTick } = require('process');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/sql');

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

User.beforeSave( async(user, options)=>{
    if(user.password.changed()){
        user.password = await bcrypt.hash(user.password)
    }

})

User.sync()

module.exports = User