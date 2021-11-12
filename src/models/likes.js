// *This files handles database related tasks for likes

// *importing database library and connection 
const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql');

const Likes = sequelize.define('Likes',{
    likedBy:{
        type: DataTypes.INTEGER,
        references:{
            model:'Users',
            key:'id'
        },
        allowNull: false
    },
    likedPost:{
        type:DataTypes.INTEGER,
        references:{
            model:'Posts',
            key:'id'
        },
        allowNull: false
    }
},{
    timestamps:true
})

// *This line allows the server to automatically create database table if it does not exist already
Likes.sync()

module.exports = Likes