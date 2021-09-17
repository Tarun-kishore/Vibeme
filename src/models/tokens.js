const { DataTypes } = require('sequelize');
const sequelize = require('../db/sql');


const Token = sequelize.define('Token',{
    user:{
        type: DataTypes.INTEGER,
        references:{
            model: 'Users',
            key:'id'
        }
    },
    token:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: true
})


Token.sync()

module.exports = Token