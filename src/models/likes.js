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

Likes.sync()


module.exports = Likes