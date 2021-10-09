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

Connection.sync()

module.exports = Connection