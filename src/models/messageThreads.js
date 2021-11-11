// *This files handles database related tasks for message Threads

// *importing database library and connection 
const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql')

// *Importing model from other file
const messages = require('./messages')

// *defining message thread schema
const messageThreads = sequelize.define('messageThreads',{
    member1:{
        type : DataTypes.INTEGER,
        references:{
            model:'Users',
            key:'id'
        },
        allowNull:false
    },
    member2:{
        type : DataTypes.INTEGER,
        references:{
            model:'Users',
            key:'id'
        },
        allowNull:false
    }
})

// * defining relation between message thread and messages
messageThreads.hasMany(messages,{
    foreignKey:'thread',
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
})

messages.belongsTo(messageThreads,{
    foreignKey:'thread'
})

// *This line allows the server to automatically create database table if it does not exist already
messageThreads.sync()

module.exports =  messageThreads