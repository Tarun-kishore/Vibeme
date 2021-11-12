// *This files handles database related tasks for connections of users

// *importing database library and connection 
const { DataTypes, where, Sequelize } = require('sequelize');
const sequelize = require('../db/sql')

const Connection = sequelize.define('Connection', {
    sentBy:{
        type: DataTypes.INTEGER,
        references:{
            model:'Users',
            key:'id'
        },
        allowNull:false
    },
    sentTo:{
        type: DataTypes.INTEGER,
        references:{
            model:'Users',
            key:'id'
        },
        allowNull:false
    },
    pending:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: true
    }
},{
    timestamps: true
})

// *This line allows the server to automatically create database table if it does not exist already
Connection.sync()

module.exports = Connection