const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql');
// const User = require('./user');

const Likes = sequelize.define('Likes',{
    likedBy:{
        type: DataTypes.INTEGER,
        references:{
            model:'User',
            key:'id'
        },
        allowNull: false
    },
    likedPost:{
        type:DataTypes.INTEGER,
        references:{
            model:'Post',
            key:'id'
        },
        allowNull: false
    }
})

Likes.sync()

module.exports = Likes