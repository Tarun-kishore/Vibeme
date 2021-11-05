const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql')

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

messageThreads.sync()

module.exports =  messageThreads