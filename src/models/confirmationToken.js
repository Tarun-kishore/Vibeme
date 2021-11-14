// *This file handles all database related tasks for confirmation tokens which will be sent to user via mail

// *importing database connections and library
const { DataTypes, where } = require("sequelize");
const sequelize = require("../db/sql");

// *defining confirmation token schema
const confirmationToken = sequelize.define('confirmationToken',{
    user: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        unique:true
    },
    token: {
    type: DataTypes.STRING,
    allowNull: false,
    },
})

// *This line allows the server to automatically create database table if it does not exist already
confirmationToken.sync()

module.exports = confirmationToken