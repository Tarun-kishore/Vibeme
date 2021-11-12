// *This files handles database related tasks for messages

// *importing database library and connection 
const { DataTypes, where } = require('sequelize');
const sequelize = require('../db/sql')

// *Schema definitions
const message = sequelize.define('message', {
    thread: {
        type: DataTypes.INTEGER,
        references: {
            model: 'messageThreads',
            key: 'id'
        },
        allowNull: false,
    }
    ,
    sender: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false
    },
    receiver: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

// *Schema statics for finding messages in a given message thread
message.findMessages = async (threadId, userId,User) => {
    const messages = await message.findAll({
        where: { thread: threadId }, include: {
            model: User,
            as: 'senderUser'
        }
    })

    const finalMessages = []
    for (const message of messages) {
        const messageObject = message.toJSON()
        messageObject.name = messageObject.senderUser.firstName + ' ' + messageObject.senderUser.lastName 

        delete messageObject.senderUser

        if(messageObject.sender === userId){
            messageObject.isMine = true;
        }

        finalMessages.push(messageObject)
    }

    return finalMessages


}

// *This line allows the server to automatically create database table if it does not exist already
message.sync()

module.exports = message