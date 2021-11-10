const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql')
const messages = require('./messages')

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

messageThreads.hasMany(messages,{
    foreignKey:'thread',
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
})

messages.belongsTo(messageThreads,{
    foreignKey:'thread'
})

messageThreads.sync()

module.exports =  messageThreads